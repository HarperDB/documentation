#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsDir = process.argv[2];
if (!docsDir) {
    console.error('Usage: convert-gitbook-to-docusaurus.js <docs-directory>');
    process.exit(1);
}

// Convert a single file
function convertFile(filePath) {
    console.log(`Converting: ${filePath}`);
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
            lines[i] = line.replace(jsonPattern, (match, index) => {
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
                // Get the depth of the current file relative to docs root
                const relativePath = path.relative(path.dirname(filePath), docsDir);
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
    const currentDir = path.dirname(filePath).replace(docsDir + '/', '');
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
    if (path.basename(filePath) === 'README.md') {
        const newPath = path.join(path.dirname(filePath), 'index.md');
        console.log(`  Renaming README.md to index.md: ${newPath}`);
        fs.renameSync(filePath, newPath);
        filePath = newPath;
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
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Converted ${filePath}`);
    }
}

// Recursively process all markdown files
function processDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
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
        
        const categoryPath = path.join(dirPath, '_category_.json');
        const categoryContent = {
            label: categoryLabel,
            position: 1,
            link: {
                type: 'generated-index',
                description: `Explore ${categoryLabel} documentation.`
            }
        };
        
        fs.writeFileSync(categoryPath, JSON.stringify(categoryContent, null, 2));
        console.log(`  Created category file for: ${dirPath}`);
    }
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            convertFile(fullPath);
        }
    }
}

console.log(`Starting GitBook to Docusaurus conversion in: ${docsDir}`);
processDirectory(docsDir);
console.log('Conversion complete!');