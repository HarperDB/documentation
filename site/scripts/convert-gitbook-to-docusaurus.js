#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// These will be set when running as a script, or passed as parameters when used as a module
let docsDir;
let outputDir;

// Convert a single file
function convertFile(filePath, targetPath, docsDir, outputDir, options = {}) {
    const displayPath = outputDir ? path.relative(docsDir, filePath) : filePath;
    console.log(`Converting: ${displayPath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Extract version from options if provided (for versioned docs)
    const version = options.version;

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
    // Also handle single backslash cases like <\< which appear in some files
    if (content.includes('<\\<') || content.includes('>\\>') || content.includes('<\\<') || content.includes('>\\>')) {
        content = content.replace(/<\\</g, '&lt;&lt;').replace(/>\\>/g, '&gt;&gt;');
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

    // Fix non-self-closing br tags
    if (content.includes('<br>')) {
        content = content.replace(/<br>/g, '<br/>');
        console.log('  Fixed non-self-closing <br> tags');
        modified = true;
    }

    // Remove backticks around br tags (weird artifact from conversion)
    if (content.includes('```````<br')) {
        content = content.replace(/```````<br/g, '<br');
        content = content.replace(/```````/g, '');
        console.log('  Fixed backticks around <br> tags');
        modified = true;
    }

    // Fix HTML tags inside code blocks
    // Look for <pre><code> blocks and escape HTML inside them
    const preCodePattern = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
    if (content.match(preCodePattern)) {
        content = content.replace(preCodePattern, (match, codeContent) => {
            // Check if there are HTML tags inside the code block
            if (codeContent.includes('<strong>') || codeContent.includes('</strong>')) {
                console.log('  Fixed HTML tags inside code block');
                // Convert to markdown code block instead
                const cleanCode = codeContent
                    .replace(/<strong>/g, '')
                    .replace(/<\/strong>/g, '')
                    .trim();
                modified = true;
                return '```\n' + cleanCode + '\n```';
            }
            return match;
        });
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

    // Fix pseudo-HTML tags that aren't meant to be HTML (like <home-dir>)
    // These break MDX parsing because it expects them to be closed
    const pseudoHtmlPattern = /<([a-z-]+)>/g;
    const pseudoTags = content.match(pseudoHtmlPattern);
    if (pseudoTags) {
        const uniqueTags = [...new Set(pseudoTags)];
        for (const tag of uniqueTags) {
            // Check if this tag is never closed in the content
            const tagName = tag.match(/<([a-z-]+)>/)[1];
            const openCount = (content.match(new RegExp(`<${tagName}>`, 'g')) || []).length;
            const closeCount = (content.match(new RegExp(`</${tagName}>`, 'g')) || []).length;
            
            if (openCount > closeCount) {
                // This tag is not properly closed
                // Split content into lines to check context
                const lines = content.split('\n');
                let updatedLines = [];
                
                for (const line of lines) {
                    let updatedLine = line;
                    const tagRegex = new RegExp(`<${tagName}>`, 'g');
                    
                    // Check each occurrence in the line
                    let match;
                    while ((match = tagRegex.exec(line)) !== null) {
                        const beforeTag = line.substring(0, match.index);
                        const afterTag = line.substring(match.index + match[0].length);
                        
                        // Count backticks before the tag to see if we're inside inline code
                        const backticksBeforeCount = (beforeTag.match(/`/g) || []).length;
                        const isInsideBackticks = backticksBeforeCount % 2 === 1;
                        
                        if (!isInsideBackticks) {
                            // Not inside backticks, wrap it
                            updatedLine = updatedLine.replace(`<${tagName}>`, `\`<${tagName}>\``);
                            console.log(`  Fixed unclosed pseudo-HTML tag: <${tagName}>`);
                            modified = true;
                        }
                    }
                    updatedLines.push(updatedLine);
                }
                
                content = updatedLines.join('\n');
            }
        }
    }

    // Fix inline JSON objects that MDX tries to parse as expressions
    // MDX will try to parse {anything} as a JavaScript expression
    // We need to escape these by wrapping in backticks
    const lines = content.split('\n');
    let hasInlineJson = false;
    let inCodeBlock = false;
    let inCodeFence = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track code blocks and fences
        if (line.startsWith('```')) {
            inCodeFence = !inCodeFence;
            continue;
        }
        
        // Track indented code blocks
        if (!inCodeFence && line.match(/^[ \t]{4,}/) && !line.trim()) {
            inCodeBlock = true;
        } else if (!line.match(/^[ \t]/) && line.trim()) {
            inCodeBlock = false;
        }
        
        // Skip if we're in a code block/fence
        if (inCodeFence || inCodeBlock) {
            continue;
        }
        
        // Look for curly braces that might be interpreted as expressions
        // More comprehensive pattern to catch JSON-like structures
        const jsonPattern = /\{[^{}]*[:,][^{}]*\}/g;
        
        if (jsonPattern.test(line)) {
            lines[i] = line.replace(jsonPattern, (match, index) => {
                // Don't wrap if already in backticks
                const beforeMatch = line.substring(0, index);
                const afterMatch = line.substring(index + match.length);
                
                // Count backticks before to see if we're in inline code
                const backticksBeforeOdd = (beforeMatch.match(/`/g) || []).length % 2 === 1;
                
                if (backticksBeforeOdd) {
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

    // Fix image paths
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    content = content.replace(imagePattern, (match, alt, src) => {
        // Check if this is a relative path containing '/images/'
        if (src.includes('/images/') && (src.startsWith('../') || src.startsWith('./'))) {
            // Extract everything after 'images/' to preserve subdirectory structure
            const imagePathMatch = src.match(/images\/(.+)$/);
            if (imagePathMatch) {
                const imagePath = imagePathMatch[1];
                
                // If version is provided, use static versioned path
                if (version) {
                    const imageSrc = `/img/v${version}/${imagePath}`;
                    console.log(`  Fixed image path for v${version}: ${src} -> ${imageSrc}`);
                    modified = true;
                    return `![${alt}](${imageSrc})`;
                } else {
                    // For current docs, use absolute path since images are served from static directory
                    const imageSrc = `/${imagePath}`;
                    
                    console.log(`  Fixed image path: ${src} -> ${imageSrc}`);
                    modified = true;
                    return `![${alt}](${imageSrc})`;
                }
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
        // Match any variation of the logging.md link with different list markers
        const loggingLinkPattern = /([-*]\s*)?\[([^\]]+)\]\(logging\.md\)/g;
        if (content.match(loggingLinkPattern)) {
            content = content.replace(loggingLinkPattern, (match, listMarker, linkText) => {
                console.log(`  Fixed logging.md -> standard-logging.md in logging index: ${match}`);
                const marker = listMarker || '';
                return `${marker}[${linkText}](standard-logging.md)`;
            });
            modified = true;
        }
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
    
    // Fix common broken link patterns
    // Fix configuration.md paths
    content = content.replace(/(\[[^\]]+\]\()\.\.\/configuration\.md([^)]*\))/g, (match, prefix, suffix) => {
        if (filePath.includes('custom-functions')) {
            const newLink = `${prefix}../deployments/configuration.md${suffix}`;
            console.log(`  Fixed configuration.md path: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });
    
    // Fix harper-studio paths from custom-functions
    content = content.replace(/(\[[^\]]+\]\()\.\.\/harper-studio\//g, (match, prefix) => {
        if (filePath.includes('custom-functions')) {
            const newLink = `${prefix}../administration/harper-studio/`;
            console.log(`  Fixed harper-studio path: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });
    
    // Fix harper-cloud paths
    content = content.replace(/(\[[^\]]+\]\()\.\.\/harper-cloud\//g, (match, prefix) => {
        if (filePath.includes('custom-functions') || filePath.includes('getting-started')) {
            const newLink = `${prefix}../deployments/harper-cloud/`;
            console.log(`  Fixed harper-cloud path: ${match} -> ${newLink}`);
            modified = true;
            return newLink;
        }
        return match;
    });
    
    // Fix REST.md case sensitivity
    content = content.replace(/(\[[^\]]+\]\([^)]*\/)REST\.md([^)]*\))/g, (match, prefix, suffix) => {
        const newLink = `${prefix}rest.md${suffix}`;
        console.log(`  Fixed REST.md case: ${match} -> ${newLink}`);
        modified = true;
        return newLink;
    });
    
    // Fix manage-schemas-browse-data.md to manage-databases-browse-data.md (4.3+)
    if (version && version >= '4.3') {
        content = content.replace(/manage-schemas-browse-data\.md/g, 'manage-databases-browse-data.md');
        if (content.includes('manage-databases-browse-data.md')) {
            console.log('  Fixed manage-schemas-browse-data.md -> manage-databases-browse-data.md');
            modified = true;
        }
    }
    
    // Fix deep relative paths (../../../)
    const deepPathPattern = /(\[[^\]]+\]\()\.\.\/\.\.\/\.\.\/([^)]+\))/g;
    if (content.match(deepPathPattern)) {
        content = content.replace(deepPathPattern, (match, prefix, path) => {
            // These deep paths are usually wrong, try to fix them
            let fixedPath = path;
            
            // Common deep path fixes
            if (path.includes('applications/define-helpers.md')) {
                fixedPath = '../applications/define-helpers.md';
            } else if (path.includes('deployments/configuration.md')) {
                fixedPath = '../../deployments/configuration.md';
            } else if (path.includes('security/basic-auth.md') || path.includes('security/jwt-auth.md')) {
                fixedPath = '../../security/' + path.split('/').pop();
            } else if (path.includes('reference/resource.md')) {
                fixedPath = '../../technical-details/reference/resource.md';
            }
            
            if (fixedPath !== path) {
                console.log(`  Fixed deep path: ../../../${path} -> ${fixedPath}`);
                modified = true;
                return prefix + fixedPath;
            }
            return match;
        });
    }
    
    // Fix all reference/resource.md links to reference/resources/
    if (!version || version === '4.6') {
        // Fix various patterns of reference/resource.md
        const resourcePatterns = [
            /\[([^\]]+)\]\(([^)]*\/)reference\/resource\.md\)/g,
            /\[([^\]]+)\]\(reference\/resource\.md\)/g,
            /\[([^\]]+)\]\(\.\.\/reference\/resource\.md\)/g,
            /\[([^\]]+)\]\(\.\.\/\.\.\/reference\/resource\.md\)/g,
            /\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/reference\/resource\.md\)/g
        ];
        
        resourcePatterns.forEach(pattern => {
            if (content.match(pattern)) {
                content = content.replace(pattern, (match, text) => {
                    // Determine the correct relative path based on the original match
                    let newPath = 'reference/resources/';
                    if (match.includes('../../../')) {
                        newPath = '../../../reference/resources/';
                    } else if (match.includes('../../')) {
                        newPath = '../../reference/resources/';
                    } else if (match.includes('../')) {
                        newPath = '../reference/resources/';
                    } else if (match.includes('/reference/')) {
                        // Preserve any path prefix
                        const prefix = match.match(/\]\(([^)]*\/)reference\/resource\.md\)/);
                        if (prefix && prefix[1]) {
                            newPath = prefix[1] + 'reference/resources/';
                        }
                    }
                    
                    console.log(`  Fixed reference/resource.md -> ${newPath}`);
                    return `[${text}](${newPath})`;
                });
                modified = true;
            }
        });
    }
    
    // Remove links to non-existent Harper Studio pages
    const removedPages = [
        'create-account.md',
        'enable-mixed-content.md',
        'instance-configuration.md',
        'instance-example-code.md'
    ];
    
    removedPages.forEach(page => {
        const pattern = new RegExp(`\\[([^\\]]+)\\]\\([^)]*harper-studio/${page}[^)]*\\)`, 'g');
        if (content.match(pattern)) {
            content = content.replace(pattern, '$1');
            console.log(`  Removed link to non-existent page: ${page}`);
            modified = true;
        }
    });
    
    // Aggressive fixes for new platform - remove problematic links in SUMMARY.md
    if (path.basename(filePath) === 'SUMMARY.md') {
        // Remove entire lines that link to non-existent administration/harper-studio pages
        const linesToRemove = [
            'administration/harper-studio/index.md',
            'administration/harper-studio/instance-metrics.md',
            'administration/harper-studio/instances.md',
            'administration/harper-studio/login-password-reset.md',
            'administration/harper-studio/manage-applications.md',
            'administration/harper-studio/manage-charts.md',
            'administration/harper-studio/manage-clustering.md',
            'administration/harper-studio/manage-instance-roles.md',
            'administration/harper-studio/manage-instance-users.md',
            'administration/harper-studio/manage-replication.md',
            'administration/harper-studio/manage-schemas-browse-data.md',
            'administration/harper-studio/manage-databases-browse-data.md',
            'administration/harper-studio/organizations.md',
            'administration/harper-studio/query-instance-data.md',
            'deployments/harper-cloud/index.md',
            'deployments/harper-cloud/alarms.md',
            'deployments/harper-cloud/instance-size-hardware-specs.md',
            'deployments/harper-cloud/iops-impact.md',
            'deployments/harper-cloud/verizon-5g-wavelength-instances.md',
            // Also version 4.1 specific paths
            'harper-studio/index.md',
            'harper-studio/instance-metrics.md',
            'harper-studio/instances.md',
            'harper-studio/login-password-reset.md',
            'harper-studio/manage-applications.md',
            'harper-studio/manage-charts.md',
            'harper-studio/manage-clustering.md',
            'harper-studio/manage-instance-roles.md',
            'harper-studio/manage-instance-users.md',
            'harper-studio/manage-schemas-browse-data.md',
            'harper-studio/organizations.md',
            'harper-studio/query-instance-data.md',
            'harper-studio/resources.md',
            'harper-cloud/index.md',
            'harper-cloud/alarms.md',
            'harper-cloud/instance-size-hardware-specs.md',
            'harper-cloud/iops-impact.md',
            'harper-cloud/verizon-5g-wavelength-instances.md'
        ];
        
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => {
            // Check if line contains any of the problematic links
            return !linesToRemove.some(link => line.includes(link));
        });
        
        if (lines.length !== filteredLines.length) {
            content = filteredLines.join('\n');
            console.log(`  Removed ${lines.length - filteredLines.length} lines with non-existent links from SUMMARY.md`);
            modified = true;
        }
        
        // Fix root README.md references - SUMMARY.md links to non-existent README.md
        content = content.replace(/\[([^\]]+)\]\(README\.md\)/g, (match, text) => {
            console.log('  Fixed README.md reference in SUMMARY.md');
            modified = true;
            return `[${text}](index.md)`;
        });
    }
    
    // Fix version-specific path issues
    if (version && version === '4.1') {
        // In 4.1, fix paths that assume newer directory structure
        content = content.replace(/\.\.\/administration\/harper-studio\//g, '../harper-studio/');
        content = content.replace(/\.\.\/deployments\/harper-cloud\//g, '../harper-cloud/');
        content = content.replace(/\.\.\/deployments\/configuration\.md/g, '../configuration.md');
        if (content.includes('../harper-studio/') || content.includes('../harper-cloud/')) {
            console.log('  Fixed 4.1 version-specific paths');
            modified = true;
        }
    }
    
    // Fix security file references that don't exist
    const securityFiles = ['basic-auth.md', 'jwt-auth.md'];
    securityFiles.forEach(file => {
        const pattern = new RegExp(`\\[([^\\]]+)\\]\\([^)]*security/${file}[^)]*\\)`, 'g');
        if (content.match(pattern)) {
            // Convert to plain text since these files don't exist
            content = content.replace(pattern, '$1');
            console.log(`  Removed broken link to security/${file}`);
            modified = true;
        }
    });
    
    // Fix any remaining broken relative paths by converting to plain text
    // This is aggressive but ensures no broken links in production
    const brokenPathPatterns = [
        /\[([^\]]+)\]\(\.\.\/administration\/harper-studio\/[^)]+\)/g,
        /\[([^\]]+)\]\(\.\.\/deployments\/harper-cloud\/[^)]+\)/g,
        /\[([^\]]+)\]\(\.\.\/harper-studio\/[^)]+\)/g,
        /\[([^\]]+)\]\(\.\.\/harper-cloud\/[^)]+\)/g
    ];
    
    brokenPathPatterns.forEach(pattern => {
        if (content.match(pattern)) {
            content = content.replace(pattern, '$1');
            console.log('  Removed broken relative path links');
            modified = true;
        }
    });
    
    // Additional fixes for dev server warnings
    // Fix version 4.1 specific issues
    if (version === '4.1') {
        // Fix path to developers/applications/define-routes.md from custom-functions
        content = content.replace(/\[([^\]]+)\]\(\.\.\/developers\/applications\/define-routes\.md\)/g, '$1');
        
        // Fix root level harper-studio and harper-cloud references
        content = content.replace(/\[([^\]]+)\]\(harper-studio\/index\.md\)/g, '$1');
        content = content.replace(/\[([^\]]+)\]\(harper-cloud\/index\.md\)/g, '$1');
        
        // Fix README.md reference in linux.md
        content = content.replace(/\[([^\]]+)\]\(README\.md\)/g, (match, text) => {
            if (filePath.includes('install-harperdb/linux.md')) {
                return `[${text}](index.md)`;
            }
            return match;
        });
    }
    
    // Fix broken paths in versions 4.2+
    if (version && version >= '4.2') {
        // Fix deployments/harper-cloud paths that don't exist
        const deploymentPaths = [
            'alarms.md',
            'instance-size-hardware-specs.md',
            'iops-impact.md',
            'verizon-5g-wavelength-instances.md'
        ];
        deploymentPaths.forEach(file => {
            const pattern = new RegExp(`\\[([^\\]]+)\\]\\([^)]*deployments/harper-cloud/${file}[^)]*\\)`, 'g');
            if (content.match(pattern)) {
                content = content.replace(pattern, '$1');
                console.log(`  Removed broken link to deployments/harper-cloud/${file}`);
                modified = true;
            }
        });
        
        // Fix administration/harper-studio paths that don't exist
        const adminPaths = [
            'instances.md',
            'instance-metrics.md',
            'manage-schemas-browse-data.md',
            'manage-databases-browse-data.md',
            'manage-applications.md',
            'query-instance-data.md'
        ];
        adminPaths.forEach(file => {
            const pattern = new RegExp(`\\[([^\\]]+)\\]\\([^)]*administration/harper-studio/${file}[^)]*\\)`, 'g');
            if (content.match(pattern)) {
                content = content.replace(pattern, '$1');
                console.log(`  Removed broken link to administration/harper-studio/${file}`);
                modified = true;
            }
        });
        
        
        // Fix developers/configuration.md paths
        content = content.replace(/\[([^\]]+)\]\([^)]*developers\/configuration\.md\)/g, (match, text) => {
            console.log('  Fixed developers/configuration.md path');
            modified = true;
            return `[${text}](../../deployments/configuration.md)`;
        });
        
        // Fix applications/dynamic-schema.md path
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/applications\/dynamic-schema\.md\)/g, '$1');
        
        // Fix getting-started paths
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/getting-started\/getting-started\.md\)/g, '$1');
        
        // Fix ../../../getting-started.md to ../../../getting-started/
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/getting-started\.md\)/g, (match, text) => {
            console.log('  Fixed getting-started.md path to getting-started/');
            return `[${text}](../../../getting-started/)`;
        });
    }
    
    // Fix defining-schemas.md reference in version 4.5
    if (version === '4.5' && filePath.includes('getting-started/first-harper-app.md')) {
        content = content.replace(/\[([^\]]+)\]\(defining-schemas\.md\)/g, '[defining schemas](../developers/applications/defining-schemas.md)');
        modified = true;
    }
    
    
    // Remove broken technical-details references
    const technicalDetailsFiles = [
        'reference.md',
        'resource-migration.md',
        'content-types.md',
        'transactions.md',
        'graphql.md'
    ];
    technicalDetailsFiles.forEach(file => {
        const patterns = [
            new RegExp(`\\[([^\\]]+)\\]\\(\\./${file}\\)`, 'g'),
            new RegExp(`\\[([^\\]]+)\\]\\([^)]*/${file}\\)`, 'g')
        ];
        patterns.forEach(pattern => {
            if (content.match(pattern)) {
                content = content.replace(pattern, '$1');
                console.log(`  Removed broken link to ${file}`);
                modified = true;
            }
        });
    });
    
    // Fix components/reference.md paths
    content = content.replace(/\[([^\]]+)\]\([^)]*components\/reference\.md\)/g, '$1');
    
    // Fix ../../../developers/components/built-in.md in release notes
    if (filePath.includes('/release-notes/') && filePath.includes('4.5.0.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/developers\/components\/built-in\.md\)/g, (match, text) => {
            console.log('  Fixed developers/components/built-in.md -> technical-details/reference/components/built-in-extensions#loadenv');
            return `[${text}](../../reference/components/built-in-extensions#loadenv)`;
        });
    }
    
    // Fix cross-directory paths to developers/applications/defining-schemas.md
    content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/developers\/applications\/defining-schemas\.md\)/g, '$1');
    
    // Fix developers/rest.md paths from technical-details
    content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/developers\/rest\.md\)/g, '$1');
    
    // Final fix for 4.1 define-routes issue
    if (version === '4.1' && filePath.includes('custom-functions/define-helpers.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/developers\/applications\/define-routes\.md[^)]*\)/g, 'define routes');
        modified = true;
    }
    
    
    // Fix specific absolute docs/ path in analytics.md
    if (filePath.includes('operations-api/analytics.md')) {
        content = content.replace(/\[([^\]]+)\]\(docs\/developers\/operations-api\/nosql-operations\.md\)/g, (match, text) => {
            console.log('  Fixed absolute docs/ path in analytics.md');
            return `[${text}](./nosql-operations.md)`;
        });
        modified = true;
    }
    
    // Fix remaining broken links
    
    // Fix developers/security/configuration.md paths in 4.1.0 release notes
    if (filePath.includes('/release-notes/') && filePath.includes('4.1.0.md')) {
        // Match any path to developers/security/configuration.md and replace with correct path
        content = content.replace(/\[([^\]]+)\]\([^)]*developers\/security\/configuration\.md([^)]*)\)/g, (match, text, anchor) => {
            console.log('  Fixed developers/security/configuration.md path in 4.1.0 release notes');
            return `[${text}](../../../developers/security/configuration.md${anchor})`;
        });
        content = content.replace(/\[([^\]]+)\]\([^)]*administration\/logging\.md([^)]*)\)/g, '$1');
        modified = true;
    }
    
    // Fix ../../../administration/administration/cloning.md (double administration) in 4.2.0 release notes
    if (filePath.includes('/release-notes/') && filePath.includes('4.2.0.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/administration\/administration\/cloning\.md\)/g, (match, text) => {
            console.log('  Fixed double administration path: administration/administration/cloning.md -> administration/cloning.md');
            return `[${text}](../../../administration/cloning.md)`;
        });
    }
    
    // Fix ../../deployments/configuration.md in rest.md for version 4.3
    if (version === '4.3' && filePath.includes('developers/rest.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/deployments\/configuration\.md([^)]*)\)/g, (match, text, anchor) => {
            console.log('  Fixed deployments/configuration.md path in rest.md');
            return `[${text}](../deployments/configuration.md${anchor})`;
        });
        modified = true;
    }
    
    // Fix ../components/reference.md in data-loader.md
    if (filePath.includes('developers/applications/data-loader.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/components\/reference\.md([^)]*)\)/g, (match, text, anchor) => {
            console.log('  Fixed ../components/reference.md -> ../../technical-details/reference/components/');
            // Map the anchor to the correct page
            if (anchor === '#extensions') {
                return `[${text}](../../technical-details/reference/components/extensions)`;
            }
            return `[${text}](../../technical-details/reference/components/${anchor})`;
        });
        modified = true;
    }
    
    // Fix ./reference.md in built-in-extensions.md
    if (filePath.includes('reference/components/built-in-extensions.md')) {
        content = content.replace(/\[([^\]]+)\]\(\.\/reference\.md([^)]*)\)/g, (match, text, anchor) => {
            console.log('  Fixed ./reference.md link in built-in-extensions.md');
            // Map the anchor to the correct page
            if (anchor === '#extensions') {
                return `[${text}](./extensions)`;
            } else if (anchor) {
                // If there's an anchor, try to map to the right file
                return `[${text}](./${anchor.substring(1)})`;
            }
            // If no anchor, just return the text without link
            return text;
        });
        modified = true;
    }
    
    // Fix content-types.md and transactions.md in instance-binding.md
    if (filePath.includes('reference/resources/instance-binding.md')) {
        content = content.replace(/\[([^\]]+)\]\(content-types\.md\)/g, (match, text) => {
            console.log('  Fixed content-types.md -> ../content-types.md');
            return `[${text}](../content-types.md)`;
        });
        content = content.replace(/\[([^\]]+)\]\(transactions\.md\)/g, (match, text) => {
            console.log('  Fixed transactions.md -> ../transactions.md');
            return `[${text}](../transactions.md)`;
        });
    }
    
    // Fix ../../../getting-started.md in current docs
    if (!version) {
        content = content.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/getting-started\.md\)/g, (match, text) => {
            console.log('  Fixed getting-started.md -> getting-started/');
            return `[${text}](../../../getting-started/)`;
        });
    }

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
        
        // Handle release notes ordering
        if (filePath.includes('/release-notes/')) {
            const pathParts = filePath.split(path.sep);
            const releaseNotesIndex = pathParts.indexOf('release-notes');
            
            if (releaseNotesIndex >= 0 && releaseNotesIndex < pathParts.length - 2) {
                const versionDir = pathParts[releaseNotesIndex + 1]; // e.g., "1.alby", "2.penny"
                const filename = path.basename(filePath, '.md');
                
                if (filename === 'index') {
                    // Version directory index files get position based on major version
                    // 4.tucker = 1, 3.monkey = 2, 2.penny = 3, 1.alby = 4
                    const majorVersion = parseInt(versionDir.split('.')[0]) || 0;
                    frontmatterFields.sidebar_position = 5 - majorVersion;
                } else if (versionDir && versionDir.match(/^\d+\./)) {
                    // For release files, calculate position based on version number
                    // Higher versions get lower positions (appear first)
                    const versionParts = filename.split('.').map(v => parseInt(v) || 0);
                    // Create a sortable number from version parts (e.g., 1.3.1 -> 10301)
                    const versionScore = versionParts[0] * 10000 + (versionParts[1] || 0) * 100 + (versionParts[2] || 0);
                    // Invert the score so higher versions get lower positions
                    frontmatterFields.sidebar_position = 99999 - versionScore;
                }
            } else if (path.basename(filePath, '.md') === 'index' && pathParts[pathParts.length - 2] === 'release-notes') {
                // Main release-notes index
                frontmatterFields.sidebar_position = 0;
            }
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
function processDirectory(dirPath, targetDirPath, docsDir = dirPath, outputDir = targetDirPath, options = {}) {
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
    
    // Special handling for release notes version directories
    if (dirPath.includes('/release-notes/') && dirPath.match(/\/\d+\.\w+$/)) {
        const versionMatch = dirPath.match(/\/(\d+)\.(\w+)$/);
        if (versionMatch) {
            const majorVersion = parseInt(versionMatch[1]);
            const versionName = versionMatch[2];
            
            const categoryPath = targetDirPath 
                ? path.join(targetDirPath, '_category_.json')
                : path.join(dirPath, '_category_.json');
            
            const categoryContent = {
                label: `HarperDB ${versionName.charAt(0).toUpperCase() + versionName.slice(1)} (Version ${majorVersion})`,
                position: 5 - majorVersion, // 4.tucker = 1, 3.monkey = 2, etc.
                link: {
                    type: 'doc',
                    id: 'index'
                }
            };
            
            fs.writeFileSync(categoryPath, JSON.stringify(categoryContent, null, 2));
            console.log(`  Created category file for release version: ${categoryPath}`);
        }
    }
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const targetPath = targetDirPath 
            ? path.join(targetDirPath, entry.name)
            : null;
        
        if (entry.isDirectory()) {
            processDirectory(fullPath, targetPath, docsDir, outputDir, options);
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
            convertFile(fullPath, targetPath, docsDir, outputDir, options);
        }
    }
}

// Export functions for use by other scripts
module.exports = {
    processDirectory,
    convertFile
};

// Run conversion if called directly (not required by another module)
if (require.main === module) {
    docsDir = process.argv[2];
    outputDir = process.argv[3]; // Optional output directory
    
    if (!docsDir) {
        console.error('Usage: convert-gitbook-to-docusaurus.js <docs-directory> [output-directory]');
        console.error('  If output-directory is not specified, files will be converted in place');
        process.exit(1);
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
}