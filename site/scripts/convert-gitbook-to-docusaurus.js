#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsDir = process.argv[2];
const outputDir = process.argv[3]; // Optional output directory

if (!docsDir) {
    console.error('Usage: convert-gitbook-to-docusaurus.js <docs-directory> [output-directory]');
    console.error('  If output-directory is not specified, files will be converted in place');
    process.exit(1);
}

// Convert a single file
function convertFile(filePath, targetPath) {
    const displayPath = outputDir ? path.relative(docsDir, filePath) : filePath;
    console.log(`Converting: ${displayPath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Convert GitBook hints to Docusaurus admonitions
    const hintPattern = /{% hint style="(info|warning|danger|success)" %}\s*([\s\S]*?)\s*{% endhint %}/g;
    if (content.match(hintPattern)) {
        content = content.replace(hintPattern, (match, style, text) => {
            const admonitionType = style === 'danger' ? 'danger' : 
                                   style === 'warning' ? 'warning' : 
                                   style === 'success' ? 'tip' : 'info';
            return `:::${admonitionType}\n${text.trim()}\n:::`;
        });
        modified = true;
    }

    // Convert GitBook tabs to Docusaurus tabs
    const tabsPattern = /{% tabs %}\s*([\s\S]*?)\s*{% endtabs %}/g;
    if (content.match(tabsPattern)) {
        content = content.replace(tabsPattern, (match, tabsContent) => {
            // This is a simplified conversion - may need enhancement
            const tabs = tabsContent.split(/{% tab title="([^"]+)" %}/);
            let docusaurusTabs = 'import Tabs from \'@theme/Tabs\';\nimport TabItem from \'@theme/TabItem\';\n\n<Tabs>\n';
            
            for (let i = 1; i < tabs.length; i += 2) {
                const title = tabs[i];
                const content = tabs[i + 1] ? tabs[i + 1].replace(/{% endtab %}/g, '').trim() : '';
                docusaurusTabs += `  <TabItem value="${title.toLowerCase().replace(/\s+/g, '-')}" label="${title}">\n\n${content}\n\n  </TabItem>\n`;
            }
            docusaurusTabs += '</Tabs>';
            return docusaurusTabs;
        });
        modified = true;
    }

    // Convert GitBook embeds
    const embedPattern = /{% embed url="([^"]+)" %}/g;
    if (content.match(embedPattern)) {
        content = content.replace(embedPattern, '[$1]($1)');
        modified = true;
    }

    // Convert ordered lists to use "1." for all items
    const orderedListPattern = /^(\s*)(\d+)\.\s+/gm;
    if (content.match(orderedListPattern)) {
        content = content.replace(orderedListPattern, '$11. ');
        modified = true;
    }

    // Fix escaped angle brackets that break MDX parsing
    // Convert <\< to << and >\> to >>
    if (content.includes('<\\<') || content.includes('>\\>')) {
        content = content.replace(/<\\</g, '&lt;&lt;').replace(/>\\>/g, '&gt;&gt;');
        console.log('  Fixed escaped angle brackets');
        modified = true;
    }

    // Fix escaped asterisks around text (GitBook bold syntax)
    // Convert \*\* to ** 
    if (content.includes('\\*\\*')) {
        content = content.replace(/\\\*\\\*/g, '**');
        console.log('  Fixed escaped asterisks');
        modified = true;
    }

    // Fix figure/img HTML tags - convert to markdown
    // GitBook uses <figure><img src="..."><figcaption>...</figcaption></figure>
    // Convert to markdown image syntax
    const figurePattern = /<figure>\s*<img\s+src="([^"]+)"[^>]*>\s*(?:<figcaption>([^<]*)<\/figcaption>)?\s*<\/figure>/gi;
    if (content.match(figurePattern)) {
        content = content.replace(figurePattern, (match, src, caption) => {
            console.log(`  Fixed figure/img tag: ${src}`);
            // Convert to markdown image syntax
            if (caption && caption.trim()) {
                return `![${caption}](${src})`;
            } else {
                return `![](${src})`;
            }
        });
        modified = true;
    }

    // Fix mismatched code fence backticks  
    // Pattern: ````javascript ... ````
    const mismatchedFences = /(^```+)(javascript|js|typescript|ts)\n([\s\S]*?)\n(```+)$/gm;
    if (content.match(mismatchedFences)) {
        content = content.replace(mismatchedFences, (match, open, lang, code, close) => {
            if (open.length !== close.length) {
                console.log(`  Fixed mismatched code fence: ${open.length} vs ${close.length} backticks`);
                // Use the standard 3 backticks
                return '```' + lang + '\n' + code + '\n```';
            }
            return match;
        });
        modified = true;
    }

    // Fix headers with generic types that confuse MDX
    // Pattern like: ### methodName: Promise<{} or Type<something>
    const headerWithGenerics = /^(#{1,6}\s+[^:\n]+):\s*([^`\n]*<[^>\n]*>?[^`\n]*)/gm;
    if (content.match(headerWithGenerics)) {
        content = content.replace(headerWithGenerics, (match, header, typeSignature) => {
            // Check if it contains angle brackets
            if (typeSignature.includes('<') || typeSignature.includes('{')) {
                console.log(`  Fixed header with generics: ${match.substring(0, 50)}...`);
                return `${header}: \`${typeSignature}\``;
            }
            return match;
        });
        modified = true;
    }

    // Fix headers with backticks to prevent MDX parsing issues
    // Two cases to handle:
    // 1. Headers with empty backticks: #### `method()`: `type``
    // 2. Headers that start with backtick but don't end with one: ### `method()`: type
    
    // First, handle headers with empty backticks
    const headersWithEmptyBackticks = /^(#{1,6}\s+.*``.*?)$/gm;
    if (content.match(headersWithEmptyBackticks)) {
        content = content.replace(headersWithEmptyBackticks, (match) => {
            // If we have empty backticks, we need to clean up
            // Find first and last backtick positions
            const firstBacktick = match.indexOf('`');
            const lastBacktick = match.lastIndexOf('`');
            
            // Keep the outer backticks, remove any in between
            const before = match.substring(0, firstBacktick + 1);
            const middle = match.substring(firstBacktick + 1, lastBacktick);
            const after = match.substring(lastBacktick);
            
            // Remove all backticks from the middle portion
            const cleanedMiddle = middle.replace(/`/g, '');
            
            console.log(`  Removed inner backticks in header: ${match.substring(0, 50)}...`);
            return before + cleanedMiddle + after;
        });
        modified = true;
    }
    
    // Second, fix headers with backtick issues
    // Pattern: ### `method()`: type - where backtick closes before end of line
    const headersWithBacktickIssues = /^(#{1,6}\s+)(.*)$/gm;
    if (content.match(headersWithBacktickIssues)) {
        content = content.replace(headersWithBacktickIssues, (match, prefix, content) => {
            const backtickCount = (content.match(/`/g) || []).length;
            // If odd number of backticks or contains backtick followed by colon
            if (backtickCount % 2 === 1 || content.match(/`:/)) {
                console.log(`  Fixed backtick issue in header: ${match.substring(0, 50)}...`);
                // Find the first backtick
                const firstBacktickIndex = content.indexOf('`');
                if (firstBacktickIndex >= 0) {
                    // Wrap everything after the header prefix in backticks
                    return `${prefix}\`${content.replace(/`/g, '')}\``;
                }
            }
            return match;
        });
        modified = true;
    }

    // Fix links in release notes for numeric.name pattern (e.g., 3.monkey)
    if (filePath.includes('/release-notes/')) {
        // Fix links like [text](n.name/) to [text](./n.name/index)
        const numericDotDirLinks = /\[([^\]]+)\]\((\d+\.\w+)\/\)/g;
        if (content.match(numericDotDirLinks)) {
            content = content.replace(numericDotDirLinks, (match, text, path) => {
                console.log(`  Fixed numeric dot directory link: ${match}`);
                return `[${text}](./${path}/index)`;
            });
            modified = true;
        }
        
        // Fix links like [text](n.name/file.md) to [text](./n.name/file.md)
        const numericDotFileLinks = /\[([^\]]+)\]\((\d+\.\w+\/[^)]+)\)/g;
        if (content.match(numericDotFileLinks)) {
            content = content.replace(numericDotFileLinks, (match, text, path) => {
                console.log(`  Fixed numeric dot file link: ${match}`);
                return `[${text}](./${path})`;
            });
            modified = true;
        }
    }

    // Fix problematic inline code patterns that confuse MDX
    // Pattern like: request.session.update(`{ key: value }`)
    // The backticks inside parentheses with curly braces cause issues
    const inlineCodeWithBackticks = /(\w+\()(`[^`]+`)\)/g;
    if (content.match(inlineCodeWithBackticks)) {
        content = content.replace(inlineCodeWithBackticks, (match, prefix, code) => {
            // If the code contains curly braces, escape them
            if (code.includes('{') || code.includes('}')) {
                console.log(`  Fixed inline code with braces: ${match.substring(0, 50)}...`);
                // Replace backticks with quotes inside the parentheses
                const fixedCode = code.replace(/`/g, "'");
                return prefix + fixedCode + ')';
            }
            return match;
        });
        modified = true;
    }

    // Fix inline JSON objects that MDX tries to parse as expressions
    // MDX will try to parse {anything} as a JavaScript expression
    // We need to escape these by wrapping in backticks
    const lines = content.split('\n');
    let hasInlineJson = false;
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track code blocks
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        
        // Skip if we're in a code block or line is indented (likely code)
        if (inCodeBlock || line.match(/^[ \t]+/)) {
            continue;
        }
        
        // Look for curly braces that might be interpreted as expressions
        // This regex finds {...} patterns that contain colons (likely JSON)
        const jsonPattern = /(\{[^{}]*:[^{}]*\})/g;
        
        if (jsonPattern.test(line)) {
            lines[i] = line.replace(jsonPattern, (match) => {
                // Don't wrap if already in backticks (check more carefully)
                const beforeMatch = line.substring(0, line.indexOf(match));
                const afterMatch = line.substring(line.indexOf(match) + match.length);
                
                // Count backticks before and after to see if we're in inline code
                const backticksBeforeOdd = (beforeMatch.match(/`/g) || []).length % 2 === 1;
                const hasBacktickAfter = afterMatch.startsWith('`');
                
                if (backticksBeforeOdd || hasBacktickAfter) {
                    // We're inside backticks, don't wrap
                    return match;
                }
                
                console.log(`  Fixed inline expression: ${match.substring(0, 50)}...`);
                hasInlineJson = true;
                return '`' + match + '`';
            });
        }
    }
    
    if (hasInlineJson) {
        content = lines.join('\n');
        modified = true;
        console.log('  Fixed inline JSON/expressions');
    }

    // Fix image paths - convert GitBook relative paths to proper relative paths
    // GitBook uses paths like ../../../images/clustering/figure1.png
    // We need to calculate the correct relative path from the current file to the images directory
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    content = content.replace(imagePattern, (match, alt, src) => {
        // Check if this is a relative path containing '/images/'
        if (src.includes('/images/') && (src.startsWith('../') || src.startsWith('./'))) {
            // Extract everything after 'images/' to preserve subdirectory structure
            const imagePathMatch = src.match(/images\/(.+)$/);
            if (imagePathMatch) {
                const imagePath = imagePathMatch[1];
                
                // Calculate relative path from current file to images directory
                // Use targetPath if provided, otherwise use filePath
                const currentFilePath = targetPath || filePath;
                const currentDocsRoot = targetPath ? outputDir : docsDir;
                
                // Get the depth of the current file relative to docs root
                const relativePath = path.relative(path.dirname(currentFilePath), currentDocsRoot);
                const imageSrc = path.join(relativePath, 'images', imagePath);
                
                console.log(`  Fixed image path: ${src} -> ${imageSrc}`);
                modified = true;
                return `![${alt}](${imageSrc})`;
            }
        }
        return match;
    });

    // Fix relative links that include the current directory in the path
    // e.g., in getting-started/index.md, links like ./getting-started/install-harper.md should be ./install-harper.md
    const currentFilePath = targetPath || filePath;
    const currentDocsRoot = targetPath ? outputDir : docsDir;
    const currentDir = path.dirname(currentFilePath).replace(currentDocsRoot + '/', '');
    if (currentDir && currentDir !== '.') {
        // Pattern to match markdown links
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        content = content.replace(linkPattern, (match, text, href) => {
            // Only process relative .md links
            if (href.startsWith('./') && href.endsWith('.md')) {
                // Remove redundant directory references
                const cleanHref = href.replace(`./${currentDir}/`, './');
                if (cleanHref !== href) {
                    console.log(`  Fixed markdown link: ${href} -> ${cleanHref}`);
                    modified = true;
                    return `[${text}](${cleanHref})`;
                }
            }
            return match;
        });
        
        // Also fix HTML anchor tags
        const anchorPattern = /<a\s+href="([^"]+)"/g;
        content = content.replace(anchorPattern, (match, href) => {
            // Process relative links (with or without ./ prefix)
            if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
                let cleanHref = href;
                
                // Add ./ prefix if not present for consistency
                if (!cleanHref.startsWith('./') && !cleanHref.startsWith('../')) {
                    cleanHref = './' + cleanHref;
                }
                
                // Remove redundant directory references
                if (currentDir && currentDir !== '.') {
                    cleanHref = cleanHref.replace(`./${currentDir}/`, './');
                }
                
                // Remove .md extension from HTML links while preserving query/anchor
                if (cleanHref.match(/\.md(?:[?#]|$)/)) {
                    cleanHref = cleanHref.replace(/\.md(?=[?#]|$)/, '');
                }
                
                // Remove trailing slash from directory links
                if (cleanHref.endsWith('/')) {
                    cleanHref = cleanHref.slice(0, -1);
                }
                
                if (cleanHref !== href) {
                    console.log(`  Fixed HTML link: ${href} -> ${cleanHref}`);
                    modified = true;
                    return `<a href="${cleanHref}"`;
                }
            }
            return match;
        });
    }

    // Convert README.md files to index.md for better Docusaurus compatibility
    let shouldRenameToIndex = false;
    if (path.basename(filePath) === 'README.md') {
        if (targetPath) {
            // When outputting to different directory, just change the target filename
            targetPath = path.join(path.dirname(targetPath), 'index.md');
            console.log(`  Converting README.md to index.md in output`);
        } else {
            // When converting in place, rename the actual file
            const newPath = path.join(path.dirname(filePath), 'index.md');
            console.log(`  Renaming README.md to index.md: ${newPath}`);
            fs.renameSync(filePath, newPath);
            filePath = newPath;
        }
    }
    
    // Handle special case: logging.md in logging directory conflicts with index.md
    // Rename to standard-logging.md to match the pattern of other files
    if (path.basename(filePath) === 'logging.md' && path.dirname(filePath).endsWith('/logging')) {
        if (targetPath) {
            // When outputting to different directory, just change the target filename
            targetPath = path.join(path.dirname(targetPath), 'standard-logging.md');
            console.log(`  Converting logging.md to standard-logging.md in output`);
        } else {
            // When converting in place, rename the actual file
            const newPath = path.join(path.dirname(filePath), 'standard-logging.md');
            console.log(`  Renaming logging.md to standard-logging.md to avoid route conflict: ${newPath}`);
            fs.renameSync(filePath, newPath);
            filePath = newPath;
        }
    }
    
    // If this is the logging index.md or README.md, update the link to standard-logging.md
    if ((path.basename(filePath) === 'index.md' || path.basename(filePath) === 'README.md') && path.dirname(filePath).endsWith('/logging')) {
        content = content.replace('[Standard Logging](logging.md)', '[Standard Logging](standard-logging.md)');
        modified = true;
    }
    
    // Fix links to logging/logging.md throughout all files (should be logging/standard-logging.md)
    const loggingLinkPattern = /(\[[^\]]+\]\()([^)]*\/)?logging\/logging\.md([^)]*\))/g;
    if (content.match(loggingLinkPattern)) {
        content = content.replace(loggingLinkPattern, (match, prefix, path, suffix) => {
            const newLink = `${prefix}${path || ''}logging/standard-logging.md${suffix}`;
            console.log(`  Fixed logging link: ${match} -> ${newLink}`);
            return newLink;
        });
        modified = true;
    }
    
    // Fix links to README.md files (should be index.md since we convert them)
    const readmeLinkPattern = /(\[[^\]]+\]\()([^)]*\/)README\.md([^)]*\))/g;
    if (content.match(readmeLinkPattern)) {
        content = content.replace(readmeLinkPattern, (match, prefix, path, suffix) => {
            const newLink = `${prefix}${path}index.md${suffix}`;
            console.log(`  Fixed README.md link: ${match} -> ${newLink}`);
            return newLink;
        });
        modified = true;
    }
    
    // Fix links based on GitBook redirects
    // 1. manage-functions → manage-applications
    content = content.replace(/(\[[^\]]+\]\([^)]*\/)manage-functions\.md([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}manage-applications.md${suffix}`;
        console.log(`  Fixed manage-functions.md link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });
    
    // 2. custom-functions/define-routes → developers/applications/define-routes
    content = content.replace(/(\[[^\]]+\]\()define-routes\.md([^)]*\))/g, (match, prefix, suffix) => {
        // Only fix if we're in custom-functions context
        if (filePath.includes('custom-functions')) {
            const newLink = `${prefix}../developers/applications/define-routes.md${suffix}`;
            console.log(`  Fixed define-routes.md link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });
    
    // 3. harperdb-studio → harper-studio
    content = content.replace(/harperdb-studio/g, (match) => {
        console.log(`  Fixed harperdb-studio -> harper-studio`);
        modified = true;
        return 'harper-studio';
    });
    
    // 4. harperdb-cloud → harper-cloud
    content = content.replace(/harperdb-cloud/g, (match) => {
        console.log(`  Fixed harperdb-cloud -> harper-cloud`);
        modified = true;
        return 'harper-cloud';
    });

    // 5. Fix absolute paths starting with docs/
    content = content.replace(/(\[[^\]]+\]\()docs\/([^)]+\))/g, (match, prefix, path) => {
        const newLink = `${prefix}/${path}`;
        console.log(`  Fixed absolute docs/ path: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 6. Fix references to non-existent resource.md files
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/reference\/resource\.md([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}/technical-details/reference/resources/index.md${suffix}`;
        console.log(`  Fixed resource.md reference: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 7. Fix links with too many ../ (e.g., ../../../../deployments should be ../../deployments from release notes)
    content = content.replace(/(\[[^\]]+\]\()(\.\.\/){4,}([^)]+\))/g, (match, prefix, dots, path) => {
        // Count actual directory depth
        const currentDepth = filePath.split('/').filter(p => p && p !== '.').length;
        const docsDepth = docsDir.split('/').filter(p => p && p !== '.').length;
        const relativeDepth = currentDepth - docsDepth - 1; // -1 for the file itself
        
        // For paths like technical-details/release-notes/4.tucker/4.1.0.md, we need ../../.. to get to docs root
        const correctDots = '../'.repeat(Math.max(1, relativeDepth));
        const newLink = `${prefix}${correctDots}${path}`;
        console.log(`  Fixed relative path depth: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 8. Fix references to custom-functions paths - these are relative paths from custom-functions files
    if (filePath.includes('custom-functions/')) {
        // Fix ../harper-studio/manage-applications.md
        content = content.replace(/(\[[^\]]+\]\()\.\.\/(harper-studio\/manage-applications\.md)([^)]*\))/g, (match, prefix, _path, suffix) => {
            const newLink = `${prefix}/administration/harper-studio/manage-applications.md${suffix}`;
            console.log(`  Fixed custom-functions link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
        
        // Fix ../configuration.md
        content = content.replace(/(\[[^\]]+\]\()\.\.\/(configuration\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
            const newLink = `${prefix}/deployments/configuration.md${suffix}`;
            console.log(`  Fixed custom-functions link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
        
        // Fix ../harper-studio/index.md
        content = content.replace(/(\[[^\]]+\]\()\.\.\/(harper-studio\/index\.md)([^)]*\))/g, (match, prefix, _path, suffix) => {
            const newLink = `${prefix}/administration/harper-studio/index.md${suffix}`;
            console.log(`  Fixed custom-functions link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 9. Fix references to ./reference.md in built-in-extensions.md
    content = content.replace(/(\[[^\]]+\]\()\.\/(reference\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
        if (filePath.includes('built-in-extensions.md')) {
            const newLink = `${prefix}/developers/components/reference.md${suffix}`;
            console.log(`  Fixed ./reference.md link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });

    // 10. Fix references to content-types.md, transactions.md in instance-binding.md
    if (filePath.includes('instance-binding.md')) {
        content = content.replace(/(\[[^\]]+\]\()(content-types\.md|transactions\.md)([^)]*\))/g, (match, prefix, file, suffix) => {
            const fileMappings = {
                'content-types.md': '/technical-details/reference/content-types.md',
                'transactions.md': '/technical-details/reference/transactions.md'
            };
            const newPath = fileMappings[file] || file;
            const newLink = `${prefix}${newPath}${suffix}`;
            console.log(`  Fixed ${file} reference: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 11. Fix resource-migration.md reference
    content = content.replace(/(\[[^\]]+\]\()\.\/(resource-migration\.md)([^)]*\))/g, (match, prefix, file, suffix) => {
        if (filePath.includes('resources/index.md')) {
            const newLink = `${prefix}/technical-details/reference/resources/resource-migration.md${suffix}`;
            console.log(`  Fixed resource-migration.md link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });

    // 12. Fix references to ../getting-started.md from deep paths
    content = content.replace(/(\[[^\]]+\]\()\.\.\/(getting-started\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
        const newLink = `${prefix}/getting-started.md${suffix}`;
        console.log(`  Fixed getting-started.md reference: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 13. Fix references to defining-schemas.md
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(defining-schemas\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
        const newLink = `${prefix}/developers/applications/defining-schemas.md${suffix}`;
        console.log(`  Fixed defining-schemas.md reference: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 14. Fix reference to ../components/reference.md in data-loader.md
    if (filePath.includes('data-loader.md')) {
        content = content.replace(/(\[[^\]]+\]\()\.\.\/(components\/reference\.md)([^)]*\))/g, (match, prefix, _path, suffix) => {
            const newLink = `${prefix}/developers/components/reference.md${suffix}`;
            console.log(`  Fixed components/reference.md link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 15. Fix references to rest.md
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(rest\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
        const newLink = `${prefix}/developers/rest.md${suffix}`;
        console.log(`  Fixed rest.md reference: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 16. Fix hash links to components/reference.md#extensions
    content = content.replace(/(\[[^\]]+\]\()\/developers\/components\/reference\.md#extensions([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}/developers/components/reference#extensions${suffix}`;
        console.log(`  Fixed hash link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 17. Fix resource-migration.md link in resources/index.md
    if (filePath.includes('resources') && (filePath.includes('index.md') || filePath.includes('README.md'))) {
        content = content.replace(/(\[[^\]]+\]\()\.\/(resource-migration\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
            const newLink = `${prefix}./resource-migration${suffix}`;
            console.log(`  Fixed resource-migration link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 18. Fix links to directories (should link to directory without trailing slash)
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(operations-api)\/$([^)]*\))/g, (match, prefix, dir, suffix) => {
        const newLink = `${prefix}/developers/${dir}${suffix}`;
        console.log(`  Fixed directory link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 19. Fix getting-started.md link from release notes
    if (filePath.includes('release-notes') && filePath.includes('tucker')) {
        content = content.replace(/(\[[^\]]+\]\()\.\.\/\.\.\/\.\.\/(getting-started\.md)([^)]*\))/g, (match, prefix, _file, suffix) => {
            const newLink = `${prefix}/getting-started/index.md${suffix}`;
            console.log(`  Fixed getting-started link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 20. Fix components/ directory link
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(developers\/components)\/$([^)]*\))/g, (match, prefix, path, suffix) => {
        const newLink = `${prefix}/${path}${suffix}`;
        console.log(`  Fixed components directory link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 21. Fix broken-reference (appears to be a placeholder)
    content = content.replace(/(\[[^\]]+\]\()broken-reference([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}#${suffix}`;
        console.log(`  Fixed broken-reference placeholder: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 22. Fix links to version subdirectories - only fix directory links, not file links
    content = content.replace(/(\[[^\]]+\]\()\.\/(3\.monkey|2\.penny|1\.alby)\/index([^)]*\))/g, (match, prefix, dir, suffix) => {
        const newLink = `${prefix}./${dir}/index.md${suffix}`;
        console.log(`  Fixed version directory link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Also fix version directory links without ./ prefix (only directories)
    content = content.replace(/(\[[^\]]+\]\()(3\.monkey|2\.penny|1\.alby)\/$([^)]*\))/g, (match, prefix, dir, suffix) => {
        const newLink = `${prefix}./${dir}/index.md${suffix}`;
        console.log(`  Fixed version directory link without prefix: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 23. Fix README.md link in SUMMARY.md
    if (filePath.includes('SUMMARY.md')) {
        content = content.replace(/(\[[^\]]+\]\()README\.md([^)]*\))/g, (match, prefix, suffix) => {
            const newLink = `${prefix}index.md${suffix}`;
            console.log(`  Fixed README.md link in SUMMARY: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 24. Fix non-existent built-in.md link - redirect to components operations API
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/developers\/components\/built-in\.md([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}/developers/operations-api/components.md${suffix}`;
        console.log(`  Fixed built-in.md link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 25. Fix hash link to reference#extensions - point to components operations API
    content = content.replace(/(\[[^\]]+\]\()\/developers\/components\/reference#extensions([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}/developers/operations-api/components#extensions${suffix}`;
        console.log(`  Fixed reference#extensions link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Also fix without /reference in path
    content = content.replace(/(\[[^\]]+\]\()\/developers\/components#extensions([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}/developers/operations-api/components#extensions${suffix}`;
        console.log(`  Fixed components#extensions link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 26. Fix resource-migration link - the actual file is migration.md
    if (filePath.includes('resources') && (filePath.includes('index.md') || filePath.includes('README.md'))) {
        content = content.replace(/(\[[^\]]+\]\()\.\/(resource-migration)(\.md)?([^)]*\))/g, (match, prefix, _file, _ext, suffix) => {
            const newLink = `${prefix}./migration.md${suffix}`;
            console.log(`  Fixed resource-migration link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 27. Fix operations-api directory link 
    content = content.replace(/(\[[^\]]+\]\()\.\.\/\.\.\/(developers\/operations-api)\/$([^)]*\))/g, (match, prefix, _path, suffix) => {
        const newLink = `${prefix}/developers/operations-api${suffix}`;
        console.log(`  Fixed operations-api directory link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 28. Fix components directory link
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(developers\/components)\/$([^)]*\))/g, (match, prefix, _path, suffix) => {
        const newLink = `${prefix}/developers/operations-api/components${suffix}`;
        console.log(`  Fixed components directory link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 29. Fix any link to components/reference.md (with or without hash)
    content = content.replace(/(\[[^\]]+\]\()[^)]*\/(components\/reference\.md)(#[^)]*)?([^)]*\))/g, (match, prefix, _path, hash, suffix) => {
        const newLink = `${prefix}/developers/operations-api/components${hash || ''}${suffix}`;
        console.log(`  Fixed components/reference.md link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 30. Fix ./reference.md links in components directory
    if (filePath.includes('/components/')) {
        content = content.replace(/(\[[^\]]+\]\()\.\/reference\.md(#[^)]*)?([^)]*\))/g, (match, prefix, hash, suffix) => {
            const newLink = `${prefix}/developers/operations-api/components${hash || ''}${suffix}`;
            console.log(`  Fixed ./reference.md link in components: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 31. Fix operations-api directory link from resources
    if (filePath.includes('/resources/')) {
        content = content.replace(/(\[[^\]]+\]\()\.\.\/\.\.\/(developers\/operations-api)\/$([^)]*\))/g, (match, prefix, _path, suffix) => {
            const newLink = `${prefix}/developers/operations-api${suffix}`;
            console.log(`  Fixed operations-api directory link from resources: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 32. Fix components directory link in release notes
    if (filePath.includes('/release-notes/')) {
        content = content.replace(/(\[[^\]]+\]\()\.\.\/\.\.\/\.\.\/(developers\/components)\/$([^)]*\))/g, (match, prefix, _path, suffix) => {
            const newLink = `${prefix}/developers/operations-api/components${suffix}`;
            console.log(`  Fixed components directory link in release notes: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // 33. Remove hash anchors that don't exist - just link to the page
    // Fix #extensions anchors
    content = content.replace(/(\[[^\]]+\]\()([^)]*\/components)(#extensions)([^)]*\))/g, (match, prefix, path, _hash, suffix) => {
        const newLink = `${prefix}${path}${suffix}`;
        console.log(`  Removed #extensions anchor: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // 34. Fix self-referencing anchors that don't exist
    content = content.replace(/\[([^\]]+)\]\((#[^)]+)\)/g, (match, linkText, hash) => {
        // For self-referencing anchors, convert to plain text
        if (hash.includes('built-in-extensions') || hash.includes('custom-component-configuration') || 
            hash.includes('scopehandleentry') || hash.includes('interface-directoryentry')) {
            console.log(`  Converted self-referencing anchor to plain text: ${match}`);
            return linkText;
        }
        return match;
    });

    // 35. Fix broken anchor links to correct targets
    // Fix #adding-an-endpoint links to point to defining-schemas
    content = content.replace(/(\[[^\]]+\]\([^)]*\/applications\/)#adding-an-endpoint([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}defining-schemas${suffix}`;
        console.log(`  Fixed #adding-an-endpoint link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix #Using-the-Configuration-File-and-Naming-Conventions to lowercase
    content = content.replace(/(\[[^\]]+\]\([^)]*configuration)\.md#Using-the-Configuration-File-and-Naming-Conventions([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}#using-the-configuration-file-and-naming-conventions${suffix}`;
        console.log(`  Fixed configuration anchor link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix #select-properties to #selectproperties
    content = content.replace(/(\[[^\]]+\]\([^)]*\/rest)\.md#select-properties([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}#selectproperties${suffix}`;
        console.log(`  Fixed #select-properties link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix #cachingconditional-requests (already lowercase, just remove .md)
    content = content.replace(/(\[[^\]]+\]\([^)]*\/rest)\.md#cachingconditional-requests([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}#cachingconditional-requests${suffix}`;
        console.log(`  Fixed #cachingconditional-requests link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix self-referencing #Role-Based-Operation-Restrictions
    if (filePath.includes('users-and-roles.md')) {
        content = content.replace(/(\[[^\]]+\]\()users-and-roles\.md#Role-Based-Operation-Restrictions([^)]*\))/g, (match, prefix, suffix) => {
            const newLink = `${prefix}#role-based-operation-restrictions${suffix}`;
            console.log(`  Fixed role-based restrictions link: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // Fix #creating-our-first-table to defining-schemas
    content = content.replace(/(\[[^\]]+\]\([^)]*\/applications\/)#creating-our-first-table([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}defining-schemas${suffix}`;
        console.log(`  Fixed #creating-our-first-table link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix globals.md self-referencing authenticateUser anchor
    if (filePath.includes('globals.md')) {
        content = content.replace(/(\[[^\]]+\]\()globals\.md#serverauthenticateuserusername-password-user([^)]*\))/g, (match, prefix, suffix) => {
            const newLink = `${prefix}#serverauthenticateuserusername-password-promiseuser${suffix}`;
            console.log(`  Fixed authenticateUser anchor: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        });
    }

    // Fix #schemas to #databases
    content = content.replace(/(\[[^\]]+\]\([^)]*configuration)\.md#schemas([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}#databases${suffix}`;
        console.log(`  Fixed #schemas link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix broken anchor links to correct targets
    content = content.replace(/(\[[^\]]+\]\([^)]*\/applications\/)#configyaml([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}../configuration${suffix}`;
        console.log(`  Fixed #configyaml link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/security\/)#authentication-configuration([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}configuration${suffix}`;
        console.log(`  Fixed #authentication-configuration link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/sql-guide\/)#sql-guide([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}${suffix}`;
        console.log(`  Fixed #sql-guide link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/operations-api\/)#authentication-tokens([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}token-authentication${suffix}`;
        console.log(`  Fixed #authentication-tokens link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/operations-api\/)#refresh-operation-tokens([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}token-authentication${suffix}`;
        console.log(`  Fixed #refresh-operation-tokens link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/developers\/)#developers([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}${suffix}`;
        console.log(`  Fixed #developers link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/administration\/)#administration([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}${suffix}`;
        console.log(`  Fixed #administration link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    content = content.replace(/(\[[^\]]+\]\([^)]*\/deployments\/)#deployments([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}${suffix}`;
        console.log(`  Fixed #deployments link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Fix #role-based-operation-restrictions link
    content = content.replace(/(\[[^\]]+\]\([^)]*\/components\/)#role-based-operation-restrictions([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}../../security/users-and-roles#role-based-operation-restrictions${suffix}`;
        console.log(`  Fixed #role-based-operation-restrictions link: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });

    // Add frontmatter if missing
    if (!content.startsWith('---')) {
        let title = '';
        let frontmatterFields = {};
        
        // Try to extract title from the first heading in the content
        const headingMatch = content.match(/^#\s+(.+)$/m);
        if (headingMatch) {
            title = headingMatch[1].trim();
        } else {
            // Fallback to filename-based title
            const filename = path.basename(filePath, '.md');
            title = filename.replace(/[-_]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        
        // Add sidebar_position: 0 for root index.md
        if (path.basename(filePath) === 'index.md' && path.dirname(filePath) === docsDir) {
            frontmatterFields.sidebar_position = 0;
        }
        
        // Build frontmatter
        let frontmatter = `---\ntitle: ${title}`;
        if (frontmatterFields.sidebar_position !== undefined) {
            frontmatter += `\nsidebar_position: ${frontmatterFields.sidebar_position}`;
        }
        frontmatter += '\n---\n\n';
        
        content = frontmatter + content;
        modified = true;
    }

    if (modified) {
        if (targetPath) {
            // Ensure target directory exists
            const targetDir = path.dirname(targetPath);
            fs.mkdirSync(targetDir, { recursive: true });
            fs.writeFileSync(targetPath, content);
            console.log(`  ✓ Converted to ${targetPath}`);
        } else {
            fs.writeFileSync(filePath, content);
            console.log(`  ✓ Converted ${filePath}`);
        }
    } else if (targetPath && filePath !== targetPath) {
        // Even if not modified, copy to target if different location
        const targetDir = path.dirname(targetPath);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(filePath, targetPath);
        console.log(`  ✓ Copied to ${targetPath}`);
    }
}

// Recursively process all markdown files
function processDirectory(dirPath, targetDirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Create target directory if specified
    if (targetDirPath) {
        fs.mkdirSync(targetDirPath, { recursive: true });
    }
    
    // Check if this directory has an index.md or will have one after README conversion
    const hasIndex = entries.some(entry => 
        entry.name === 'index.md' || entry.name === 'README.md'
    );
    
    // If no index file and this isn't the root docs directory, create a category file
    if (!hasIndex && dirPath !== docsDir) {
        const dirName = path.basename(dirPath);
        const categoryLabel = dirName.replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        const categoryPath = targetDirPath 
            ? path.join(targetDirPath, '_category_.json')
            : path.join(dirPath, '_category_.json');
        const categoryContent = {
            label: categoryLabel,
            position: 1,
            link: {
                type: 'generated-index',
                description: `Explore ${categoryLabel} documentation.`
            }
        };
        
        fs.writeFileSync(categoryPath, JSON.stringify(categoryContent, null, 2));
        console.log(`  Created category file for: ${categoryPath}`);
    }
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const targetPath = targetDirPath 
            ? path.join(targetDirPath, entry.name)
            : null;
        
        if (entry.isDirectory()) {
            processDirectory(fullPath, targetPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // Skip blank index.md files when there's a README.md in the same directory
            if (entry.name === 'index.md') {
                const indexContent = fs.readFileSync(fullPath, 'utf8').trim();
                const hasReadme = entries.some(e => e.name === 'README.md');
                if (hasReadme && indexContent.includes('blank index file')) {
                    console.log(`  Skipping blank GitBook index.md in favor of README.md: ${fullPath}`);
                    continue;
                }
            }
            convertFile(fullPath, targetPath);
        }
    }
}

if (outputDir) {
    console.log(`Starting GitBook to Docusaurus conversion`);
    console.log(`  Source: ${docsDir}`);
    console.log(`  Output: ${outputDir}`);
    processDirectory(docsDir, outputDir);
} else {
    console.log(`Starting GitBook to Docusaurus conversion in: ${docsDir}`);
    console.log(`  Converting files in place`);
    processDirectory(docsDir, null);
}
console.log('Conversion complete!');