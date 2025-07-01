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

    // Fix image paths - convert relative paths to absolute
    // In documentation repo: ../images/foo.png
    // In harperdb: /docs/images/foo.png (for production)
    // In local preview: /images/foo.png (Docusaurus serves from static/)
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    content = content.replace(imagePattern, (match, alt, src) => {
        if (src.startsWith('../images/') || src.startsWith('./images/')) {
            // Use /images/ for now - can be adjusted based on where images are served from
            return `![${alt}](/images/${path.basename(src)})`;
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