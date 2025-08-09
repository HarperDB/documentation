#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ============================================================================
// VERSION CONFIGURATION
// ============================================================================

const VERSION_CONFIG = {
    '4.1': {
        // Version 4.1 specific configurations
        directoryMappings: {
            'harperdb-studio': 'harper-studio',
            'harperdb-cloud': 'harper-cloud',
            'install-harper': 'install-harperdb'
        },
        linkReplacements: {
            'manage-applications.md': 'manage-functions.md',
            'manage-applications': 'manage-functions',
            // Fix define-routes links for 4.1
            'define-routes': './define-routes',
            '/4.1/developers/applications/routes': './define-routes',
            // Fix install-harperdb link
            './install-harperdb/index': '../install-harperdb/',
            // Fix index link in subdirectories
            '](index)': '](./)'
        },
        featureAvailability: {
            harperCloud: false,
            customFunctions: true
        },
        customFixes: {
            // Special handling for 4.1 security paths
            removeSecurityLinks: true,
            // Configuration is at root level in 4.1
            fixConfigurationPath: true
        }
    },
    '4.2': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {
            // Fix define-routes links - multiple patterns
            '](define-routes)': '](../developers/applications/define-routes)',
            './define-routes': '../developers/applications/define-routes',
            '../../developers/applications/define-routes': '../developers/applications/define-routes',
            // Fix configuration link to point to deployments
            '../configuration': '../deployments/configuration',
            // Fix harperdb-studio links to administration
            '../harperdb-studio/manage-functions': '../administration/harperdb-studio/manage-functions',
            '../harperdb-studio': '../administration/harperdb-studio',
            '../administration/harperdb-studio/index': '../administration/harperdb-studio/'
        },
        featureAvailability: {
            harperCloud: false,
            customFunctions: true
        }
    },
    '4.3': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {
            // Don't do broad replacements - handle in version-specific fixes
            // Fix configuration link
            '../configuration': '../deployments/configuration'
        },
        featureAvailability: {
            harperCloud: false,
            customFunctions: true
        }
    },
    '4.4': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {},
        featureAvailability: {
            harperCloud: true,
            customFunctions: true,
            resources: false  // Resources feature not available in 4.4
        }
    },
    '4.5': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {},
        featureAvailability: {
            harperCloud: true,
            customFunctions: true,
            resources: false  // Resources feature not available in 4.5
        }
    },
    '4.6': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {},
        featureAvailability: {
            harperCloud: true,
            customFunctions: true
        }
    },
    'current': {
        directoryMappings: {
            'harper-studio': 'harper-studio',
            'harper-cloud': 'harper-cloud'
        },
        linkReplacements: {},
        featureAvailability: {
            harperCloud: true,
            customFunctions: true
        },
        customFixes: {
            removeIndividualReleaseNotes: true
        }
    }
};

// ============================================================================
// LINK FIXING PATTERNS
// ============================================================================

const LINK_PATTERNS = {
    // Centralized link fixing patterns to avoid redundancy
    global: {
        // README.md should become index.md references
        'README.md': 'index.md',
        // Fix reference paths
        'reference/resource/': 'reference/resources/',
        'reference/resource.md': 'reference/resources.md',
        // Fix components paths (only for versions that have built-in-extensions)
        // Note: 4.5 uses 'built-in.md', 4.6+ uses 'built-in-extensions.md'
        // Fix duplicate docs/ prefix
        'docs/developers/': 'developers/',
        'docs/administration/': 'administration/',
        'docs/technical-details/': 'technical-details/'
    },
    
    // Path-specific patterns
    byPath: {
        '/developers/applications/': {
            '../components/reference': '../../technical-details/reference/components'
        },
        '/technical-details/reference/components/built-in-extensions': {
            './reference': '..'
        },
        '/technical-details/reference/resources/': {
            '../../developers/applications/defining-schemas': '../../../developers/applications/defining-schemas',
            '../../developers/rest': '../../../developers/rest',
            'content-types': '../content-types',
            'transactions': '../transactions'
        },
        '/developers/operations-api/analytics': {
            'docs/developers/operations-api/nosql-operations': './nosql-operations'
        }
    }
};

// ============================================================================
// BROKEN LINKS TO REMOVE
// ============================================================================

const BROKEN_LINKS = {
    global: [
        // Pages that don't exist in any version
        'administration/harper-studio/instances.md',
        'administration/harper-studio/instance-metrics.md',
        'administration/harper-studio/manage-schemas-browse-data.md',
        'administration/harper-studio/manage-databases-browse-data.md',
        'administration/harper-studio/manage-applications.md',
        'administration/harper-studio/query-instance-data.md',
        'deployments/harper-cloud/alarms.md',
        'deployments/harper-cloud/instance-size-hardware-specs.md',
        'deployments/harper-cloud/iops-impact.md',
        'deployments/harper-cloud/verizon-5g-wavelength-instances.md',
        'content-types.md'
    ],
    
    byVersion: {
        '4.1': [
            'security/basic-auth.md',
            'security/jwt-auth.md',
            'security/certificate-management.md',
            'security/mtls-auth.md'
        ],
        '4.2': [
            'applications/studio.harperdb.io',
            'replication/'
        ],
        '4.3': [
            'replication/'
        ]
    }
};

// ============================================================================
// CORE CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert GitBook syntax to Docusaurus
 */
function convertGitBookSyntax(content) {
    let modified = false;
    
    // Remove GitBook-style anchor tags from headers
    // Convert `## <a id="anchor-name"></a> Header Text` to `## Header Text`
    content = content.replace(/^(#{1,6})\s*<a\s+(?:id|name)="[^"]*">\s*<\/a>\s*/gm, '$1 ');
    // Also handle inline version: `## Header Text <a id="anchor-name"></a>`
    content = content.replace(/^(#{1,6}.*?)\s*<a\s+(?:id|name)="[^"]*">\s*<\/a>\s*$/gm, '$1');
    // Handle backtick wrapped headers with anchors
    content = content.replace(/^(#{1,6})\s*`<a\s+(?:id|name)="[^"]*">\s*<\/a>\s*([^`]+)`/gm, '$1 $2');
    modified = true;
    
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
    
    return { content, modified };
}

/**
 * Fix MDX parsing issues
 */
function fixMDXSyntax(content, filePath) {
    let modified = false;
    
    // Fix escaped angle brackets
    if (content.includes('<\\<') || content.includes('>\\>')) {
        content = content.replace(/<\\</g, '&lt;&lt;').replace(/>\\>/g, '&gt;&gt;');
        modified = true;
    }
    
    // Fix escaped asterisks
    if (content.includes('\\*\\*')) {
        content = content.replace(/\\\*\\\*/g, '**');
        modified = true;
    }
    
    // Convert figure/img HTML tags to markdown
    const figurePattern = /<figure>\s*<img\s+src="([^"]+)"[^>]*>\s*(?:<figcaption>([^<]*)<\/figcaption>)?\s*<\/figure>/gi;
    if (content.match(figurePattern)) {
        content = content.replace(figurePattern, (match, src, caption) => {
            return caption && caption.trim() ? `![${caption}](${src})` : `![](${src})`;
        });
        modified = true;
    }
    
    // Fix non-self-closing br tags
    content = content.replace(/<br>/g, '<br />');
    
    // Fix inline style attributes - convert CSS string to JSX object format
    // This handles cases like style="color: red; background: blue;" -> style={{color: 'red', background: 'blue'}}
    const inlineStylePattern = /<([^>]+)\sstyle\s*=\s*"([^"]+)"([^>]*)>/g;
    if (content.match(inlineStylePattern)) {
        content = content.replace(inlineStylePattern, (match, tagStart, styleString, tagEnd) => {
            // Parse CSS string into object properties
            const styleProps = styleString.split(';')
                .filter(prop => prop.trim())
                .map(prop => {
                    const [key, value] = prop.split(':').map(s => s.trim());
                    // Handle !important (remove it as it's not supported in React style objects)
                    const cleanValue = value.replace(/\s*!important/g, '');
                    
                    // Check if key starts with -- (CSS custom property)
                    if (key.startsWith('--')) {
                        // CSS custom properties must be quoted as object keys
                        return `'${key}': '${cleanValue}'`;
                    } else {
                        // Convert CSS property names to camelCase
                        const camelKey = key.replace(/-([a-z])/g, (m, letter) => letter.toUpperCase());
                        return `${camelKey}: '${cleanValue}'`;
                    }
                })
                .join(', ');
            
            // Return the tag with JSX style object
            modified = true;
            return `<${tagStart} style={{${styleProps}}}${tagEnd}>`;
        });
    }
    
    // Fix HTML tags inside <pre><code> blocks
    // Look for <pre><code> blocks and convert to markdown code blocks, removing HTML
    const preCodePattern = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
    if (content.match(preCodePattern)) {
        content = content.replace(preCodePattern, (match, codeContent) => {
            // Check if there are HTML tags inside the code block
            if (codeContent.includes('<strong>') || codeContent.includes('</strong>')) {
                // Convert to markdown code block, removing HTML tags
                const cleanCode = codeContent
                    .replace(/<strong>/g, '')
                    .replace(/<\/strong>/g, '')
                    .trim();
                modified = true;
                return '```\n' + cleanCode + '\n```';
            }
            // Even without strong tags, convert pre/code to markdown code blocks
            modified = true;
            return '```\n' + codeContent.trim() + '\n```';
        });
    }
    
    // Fix mismatched code block fences
    const codeBlockPattern = /^```[\s\S]*?^```/gm;
    const allCodeBlocks = content.match(codeBlockPattern) || [];
    
    for (const block of allCodeBlocks) {
        const lines = block.split('\n');
        const openingFence = lines[0];
        const closingFence = lines[lines.length - 1];
        
        if (openingFence !== closingFence.trim()) {
            const fence = openingFence.match(/^`+/)[0];
            lines[lines.length - 1] = fence;
            const fixedBlock = lines.join('\n');
            content = content.replace(block, fixedBlock);
            modified = true;
        }
    }
    
    // Fix headers with generics and incomplete type definitions
    const lines = content.split('\n');
    const processedLines = [];
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Track code blocks
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
        }
        
        // Fix incomplete Promise<{} type definitions in headers
        if (line.includes('Promise<{}') && line.startsWith('#')) {
            // This appears to be a method signature that's missing closing > and backticks
            line = line.replace(/^(#{1,6}\s+)(.*Promise<\{\}.*)$/, (match, hashes, content) => {
                // Add the missing closing > and wrap in backticks
                const fixedContent = content.replace('Promise<{}', 'Promise<{}>');
                modified = true;
                return `${hashes}\`${fixedContent}\``;
            });
        }
        
        // Check if line is a header with generic syntax or return types (not in code block)
        if (!inCodeBlock && line.match(/^#{1,6}\s+/)) {
            // Fix partially wrapped method signatures with generics
            // Pattern: ### `method(params)`: ReturnType<Generic> (backtick only around method, not return type)
            const partialBacktickPattern = /^(#{1,6}\s+)`([^`]+\([^)]*\))`:\s*([^`]+<[^>]+>.*)$/;
            const partialMatch = line.match(partialBacktickPattern);
            if (partialMatch) {
                // Fix by wrapping the entire signature
                line = `${partialMatch[1]}\`${partialMatch[2]}: ${partialMatch[3]}\``;
                modified = true;
            }
            // Check for method signatures with return types containing generics (no backticks)
            else {
                const methodSignaturePattern = /^(#{1,6}\s+)([^`]+\([^)]*\)):\s*(.+)$/;
                const methodMatch = line.match(methodSignaturePattern);
                if (methodMatch && methodMatch[3].includes('<')) {
                    // Has a return type with generics - wrap entire signature
                    line = `${methodMatch[1]}\`${methodMatch[2]}: ${methodMatch[3]}\``;
                    modified = true;
                }
                // Check for other headers with generic syntax
                else if (line.match(/^#{1,6}\s+.*<[^>]+>.*$/)) {
                    if (!line.includes('`')) {
                        const headerMatch = line.match(/^(#{1,6}\s+)(.*)/);
                        if (headerMatch) {
                            line = `${headerMatch[1]}\`${headerMatch[2]}\``;
                            modified = true;
                        }
                    }
                }
            }
        }
        
        processedLines.push(line);
    }
    
    content = processedLines.join('\n');
    
    // Fix style attributes (convert to JSX)
    const stylePattern = /style="([^"]+)"/g;
    if (content.match(stylePattern)) {
        content = content.replace(stylePattern, (match, styles) => {
            try {
                const styleObj = {};
                styles.split(';').forEach(style => {
                    if (style.trim()) {
                        const [prop, value] = style.split(':').map(s => s.trim());
                        const camelCaseProp = prop.replace(/-([a-z])/g, (m, char) => char.toUpperCase());
                        styleObj[camelCaseProp] = value;
                    }
                });
                return `style={{${Object.entries(styleObj).map(([k, v]) => `${k}: '${v}'`).join(', ')}}}`;
            } catch (e) {
                // If conversion fails, remove the style
                return '';
            }
        });
        modified = true;
    }
    
    // Fix pseudo-HTML tags (wrap in backticks)
    const pseudoTags = ['<home-dir>', '<project-directory>', '<harperdb-home>', '<DIRECTORY_PATH>'];
    for (const tag of pseudoTags) {
        if (content.includes(tag)) {
            content = content.replace(new RegExp(tag.replace(/[<>]/g, '\\$&'), 'g'), `\`${tag}\``);
            modified = true;
        }
    }
    
    // Fix inline JSON/expressions that break MDX
    const processedLines2 = [];
    inCodeBlock = false;
    let inCodeFence = false;
    
    for (const line of content.split('\n')) {
        // Track code blocks
        if (line.trim().startsWith('```')) {
            inCodeFence = !inCodeFence;
            processedLines2.push(line);
            continue;
        }
        
        if (line.trim().startsWith('    ') && !inCodeFence) {
            inCodeBlock = true;
        } else if (!line.trim().startsWith('    ') && line.trim() !== '') {
            inCodeBlock = false;
        }
        
        if (inCodeBlock || inCodeFence) {
            processedLines2.push(line);
            continue;
        }
        
        // Fix inline JSON patterns
        let processedLine = line;
        
        // Pattern 1: Simple key:value
        processedLine = processedLine.replace(/(\s|^)(\{[^}]*:[^}]*\})(\s|$)/g, (match, before, json, after) => {
            if (!json.includes('`')) {
                modified = true;
                return `${before}\`${json}\`${after}`;
            }
            return match;
        });
        
        // Pattern 1b: Fix specific JSON patterns that appear inline in text
        // These patterns appear in the middle of sentences in json-search.md
        // More comprehensive pattern to catch various inline JSON
        // Look for patterns like: with: {"actor": name, "character": character}.
        const jsonAfterColonRegex = /(:\s*)(\{[^}]+\})(\.|\s)/g;
        if (processedLine.match(jsonAfterColonRegex)) {
            processedLine = processedLine.replace(jsonAfterColonRegex, (match, prefix, json, suffix) => {
                // Only wrap if not already in backticks
                if (!match.includes('`')) {
                    modified = true;
                    return `${prefix}\`${json}\`${suffix}`;
                }
                return match;
            });
        }
        
        // Also handle specific known patterns
        const inlineJSONPatterns = [
            '{"actor": name, "character": character}',
            '{actor: name, character: character}'
        ];
        
        for (const pattern of inlineJSONPatterns) {
            if (processedLine.includes(pattern) && !processedLine.includes('`' + pattern)) {
                const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                processedLine = processedLine.replace(new RegExp(escapedPattern, 'g'), '`' + pattern + '`');
                modified = true;
            }
        }
        
        // Pattern 2: Array destructuring
        processedLine = processedLine.replace(/(\[[^\]]+\])\s*=\s*([^;,\n]+)/g, (match, arr, val) => {
            if (!match.includes('`')) {
                modified = true;
                return `\`${match}\``;
            }
            return match;
        });
        
        processedLines2.push(processedLine);
    }
    
    if (modified) {
        content = processedLines2.join('\n');
    }
    
    // Normalize ordered lists
    content = content.replace(/^(\s*)(\d+)\.\s+/gm, '$11. ');
    
    return { content, modified };
}

/**
 * Fix image paths for versioned docs
 */
function fixImagePaths(content, version) {
    let modified = false;
    
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    content = content.replace(imagePattern, (match, alt, src) => {
        // Skip external images
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return match;
        }
        
        let newSrc = src;
        
        // Fix paths that incorrectly reference static directory
        if (src.includes('/static/img/')) {
            newSrc = src.replace(/^\.\.\/+static\/img\//, '/img/');
            modified = true;
        }
        // Fix relative image paths
        else if (src.includes('/images/') && (src.startsWith('../') || src.startsWith('./'))) {
            const imagePathMatch = src.match(/images\/(.+)$/);
            if (imagePathMatch) {
                const imagePath = imagePathMatch[1];
                newSrc = version ? `/img/v${version}/${imagePath}` : `/${imagePath}`;
                modified = true;
            }
        }
        
        return newSrc !== src ? `![${alt}](${newSrc})` : match;
    });
    
    return { content, modified };
}

/**
 * Apply version-specific transformations
 */
function applyVersionSpecificFixes(content, filePath, version) {
    if (!version || !VERSION_CONFIG[version]) {
        return { content, modified: false };
    }
    
    let modified = false;
    const config = VERSION_CONFIG[version];
    
    // Apply directory mappings
    if (config.directoryMappings) {
        for (const [from, to] of Object.entries(config.directoryMappings)) {
            const pattern = new RegExp(`(\\[[^\\]]+\\]\\([^)]*/)${from}(/[^)]*\\))`, 'g');
            if (content.match(pattern)) {
                content = content.replace(pattern, `$1${to}$2`);
                modified = true;
            }
        }
    }
    
    // Apply link replacements
    if (config.linkReplacements) {
        for (const [from, to] of Object.entries(config.linkReplacements)) {
            if (content.includes(from)) {
                content = content.replace(new RegExp(from, 'g'), to);
                modified = true;
            }
        }
    }
    
    // Additional version-specific pattern-based fixes
    if (version === '4.1') {
        // Fix all variations of /docs/4.1/harperdb-studio/index links
        const studioIndexPattern = /\/docs\/4\.1\/harperdb-studio\/index/g;
        if (content.match(studioIndexPattern)) {
            content = content.replace(studioIndexPattern, '../harperdb-studio/');
            modified = true;
        }
        
        // Fix harperdb-cli link to install-harperdb
        if (filePath.includes('harperdb-cli')) {
            content = content.replace(/\]\(\.\.\/install-harperdb\//g, '](./install-harperdb/');
            modified = true;
        }
    }
    
    if (version === '4.2') {
        // Fix define-routes link in custom-functions
        if (filePath.includes('/custom-functions/')) {
            // Match various forms of define-routes links
            content = content.replace(/\]\(define-routes\.md\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(define-routes\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(\.\/define-routes\)/g, '](../developers/applications/define-routes)');
            modified = true;
        }
        
        // Fix paths in developers/applications
        if (filePath.includes('/developers/applications/')) {
            // Fix relative paths to resources - use correct singular form for 4.2
            content = content.replace(/\/docs\/technical-details\/reference\/resources/g, '/4.2/technical-details/reference/resource');
            content = content.replace(/\/technical-details\/reference\/resources/g, '/4.2/technical-details/reference/resource');
            // Fix relative paths within applications
            content = content.replace(/\.\.\/\.\.\/developers\/applications\//g, './');
            content = content.replace(/\.\.\/developers\/applications\//g, './');
            content = content.replace(/\.\.\/\.\.\/developers\/applications\/define-helpers/g, './define-helpers');
            // Fix incorrect double-relative paths
            content = content.replace(/\.\.\/\.\.\/applications\//g, './');
            content = content.replace(/\.\.\/applications\//g, './');
            // Fix broken define-helpers link in define-routes
            content = content.replace(/\.\.\/\.\.\/\.\.\/applications\/define-helpers/g, '../../custom-functions/define-helpers');
            content = content.replace(/\.\.\/\.\/define-helpers/g, '../../custom-functions/define-helpers');
            content = content.replace(/\.\/define-helpers/g, '../../custom-functions/define-helpers');
            // Fix broken studio.harperdb.io link - make it external
            content = content.replace(/\]\(\.\.\/\.\.\/applications\/studio\.harperdb\.io\)/g, '](https://studio.harperdb.io)');
            content = content.replace(/\]\(\.\/studio\.harperdb\.io\)/g, '](https://studio.harperdb.io)');
            // Fix broken dynamic-schema link
            content = content.replace(/\.\.\/\.\.\/applications\/dynamic-schema/g, '../../technical-details/reference/dynamic-schema');
            content = content.replace(/\.\/dynamic-schema/g, '../../technical-details/reference/dynamic-schema');
            modified = true;
        }
        
        // Fix paths in developers/components
        if (filePath.includes('/developers/components/')) {
            content = content.replace(/\.\/developers\/applications\//g, '../applications/');
            content = content.replace(/\.\.\/\/technical-details\/reference\/resources/g, '../../technical-details/reference/resource');
            content = content.replace(/technical-details\/reference\/resources/g, '../../technical-details/reference/resource');
            content = content.replace(/\/docs\/technical-details\/reference\/resources/g, '/4.2/technical-details/reference/resource');
            content = content.replace(/\/technical-details\/reference\/resources/g, '/4.2/technical-details/reference/resource');
            // Fix writing-extensions resource link
            content = content.replace(/\.\.\/\.\.\/\.\.\/reference\/resource/g, '../../technical-details/reference/resource');
            // Fix incorrect references to harperdb-cloud and harperdb-studio
            content = content.replace(/\.\.\/\.\.\/\.\.\/harperdb-cloud\//g, '/4.2/deployments/harperdb-cloud/');
            content = content.replace(/\.\.\/\.\.\/\.\.\/administration\/harperdb-studio\//g, '/4.2/administration/harperdb-studio/');
            modified = true;
        }
        
        // Fix configuration links for clustering
        if (filePath.includes('/clustering/') || filePath.includes('/security/')) {
            content = content.replace(/\.\.\/\.\.\/developers\/configuration/g, '/4.2/deployments/configuration');
            modified = true;
        }
        
        // Fix release notes numbered directory links
        const releaseNotesPattern = /\]\(\.\.\/\.\.\/release-notes\/([1-4])\.(alby|penny|monkey|tucker)/g;
        if (content.match(releaseNotesPattern)) {
            content = content.replace(releaseNotesPattern, (match, num, name) => {
                return `](../../release-notes/v${num}-${name}`;
            });
            modified = true;
        }
    }
    
    if (version === '4.3') {
        // Fix define-routes in custom-functions
        if (filePath.includes('/custom-functions/')) {
            // Fix various define-routes patterns - the file moved to developers/applications
            // Use absolute paths since relative paths across sections don't work properly
            content = content.replace(/\]\(\.\.\/\.\.\/developers\/applications\/define-routes\)/g, '](/4.3/developers/applications/define-routes)');
            content = content.replace(/\]\(define-routes\.md\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(define-routes\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(\.\/define-routes\)/g, '](../developers/applications/define-routes)');
            // Fix harperdb-studio links - manage-functions should be manage-applications
            content = content.replace(/\.\.\/administration\/harperdb-studio\/manage-functions/g, '../administration/harperdb-studio/manage-applications');
            content = content.replace(/\.\.\/harperdb-studio/g, '../administration/harperdb-studio');
            modified = true;
        }
        
        // Fix paths in developers/applications
        if (filePath.includes('/developers/applications/')) {
            // Fix define-routes self-reference
            content = content.replace(/\]\(\.\.\/\.\/define-routes\)/g, '](./define-routes)');
            // For 4.3, since custom-functions is excluded, point define-helpers to the helper-methods section
            content = content.replace(/\.\.\/\.\.\/\.\.\/applications\/define-helpers\.md/g, '#helper-methods');
            content = content.replace(/\.\.\/\.\.\/\.\.\/applications\/define-helpers/g, '#helper-methods');
            content = content.replace(/\.\.\/\.\.\/developers\/applications\/define-helpers/g, '#helper-methods');
            content = content.replace(/\.\.\/\.\/define-helpers/g, '#helper-methods');
            content = content.replace(/\.\.\/developers\/applications\//g, './');
            // Fix incorrect double-relative paths
            content = content.replace(/\.\.\/\.\.\/applications\//g, './');
            content = content.replace(/\.\.\/applications\//g, './');
            // Fix dynamic-schema link
            content = content.replace(/\.\/dynamic-schema/g, '../../technical-details/reference/dynamic-schema');
            modified = true;
        }
        
        // Fix paths in developers/components
        if (filePath.includes('/developers/components/')) {
            content = content.replace(/\.\/developers\/applications\//g, '../applications/');
            content = content.replace(/technical-details\/reference\/resources/g, '../../technical-details/reference/resource');
            // Fix writing-extensions resource link
            content = content.replace(/\.\.\/\.\.\/\.\.\/reference\/resource\.md/g, '../../technical-details/reference/resource');
            content = content.replace(/\.\.\/\.\.\/\.\.\/reference\/resource/g, '../../technical-details/reference/resource');
            // Fix incorrect references to harperdb-cloud and harperdb-studio
            content = content.replace(/\.\.\/\.\.\/\.\.\/harperdb-cloud\//g, '/4.3/deployments/harperdb-cloud/');
            content = content.replace(/\.\.\/\.\.\/\.\.\/harperdb-studio\//g, '/4.3/administration/harperdb-studio/');
            modified = true;
        }
        
        // Fix configuration links for clustering
        if (filePath.includes('/clustering/') || filePath.includes('/security/')) {
            content = content.replace(/\.\.\/\.\.\/developers\/configuration/g, '/4.3/deployments/configuration');
            modified = true;
        }
        
        // Fix REST link
        if (filePath.includes('/administration/harperdb-studio/')) {
            content = content.replace(/\.\.\/\.\.\/developers\/REST/g, '../../developers/rest');
            modified = true;
        }
        
        // Fix REST configuration link - needs absolute path to stay within version
        if (filePath.includes('/developers/rest')) {
            content = content.replace(/\]\(\.\.\/\.\.\/deployments\/configuration\.md#http\)/g, '](/4.3/deployments/configuration#http)');
            content = content.replace(/\]\(\.\.\/\.\.\/deployments\/configuration#http\)/g, '](/4.3/deployments/configuration#http)');
            modified = true;
        }
        
        // Fix release notes numbered directory links
        if (filePath.includes('/technical-details/release-notes/')) {
            // These directories get renamed to v#-name format
            // Handle both patterns with and without technical-details
            content = content.replace(/\.\.\/\.\.\/technical-details\/release-notes\/4\.tucker/g, './v4-tucker');
            content = content.replace(/\.\.\/\.\.\/technical-details\/release-notes\/3\.monkey/g, './v3-monkey');
            content = content.replace(/\.\.\/\.\.\/technical-details\/release-notes\/2\.penny/g, './v2-penny');
            content = content.replace(/\.\.\/\.\.\/technical-details\/release-notes\/1\.alby/g, './v1-alby');
            // Also handle the shorter pattern
            content = content.replace(/\.\.\/\.\.\/release-notes\/4\.tucker/g, './v4-tucker');
            content = content.replace(/\.\.\/\.\.\/release-notes\/3\.monkey/g, './v3-monkey');
            content = content.replace(/\.\.\/\.\.\/release-notes\/2\.penny/g, './v2-penny');
            content = content.replace(/\.\.\/\.\.\/release-notes\/1\.alby/g, './v1-alby');
            modified = true;
        }
    }
    
    if (version === '4.4' || version === '4.5') {
        // Fix custom-functions links
        if (filePath.includes('/custom-functions/')) {
            // Fix define-routes links
            content = content.replace(/\]\(define-routes\.md\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(define-routes\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(\.\/define-routes\)/g, '](../developers/applications/define-routes)');
            // Fix configuration link
            content = content.replace(/\]\(\.\.\/configuration/g, '](../deployments/configuration');
            // Fix manage-functions to manage-applications (file doesn't exist)
            content = content.replace(/\]\(\.\.\/harper-studio\/manage-functions\.md\)/g, '](../administration/harper-studio/manage-applications)');
            content = content.replace(/\]\(\.\.\/harper-studio\/manage-functions\)/g, '](../administration/harper-studio/manage-applications)');
            // Fix harper-studio path (it's under administration)
            content = content.replace(/\]\(\.\.\/harper-studio\//g, '](../administration/harper-studio/');
            modified = true;
        }
        
        // Fix google-data-studio links
        if (filePath.includes('/developers/miscellaneous/google-data-studio')) {
            content = content.replace(/\]\(deployments\/harper-cloud\//g, '](../../deployments/harper-cloud/');
            // Fix administration link to harper-studio
            content = content.replace(/\]\(\.\.\/\.\.\/administration\/harperdb-studio\//g, '](../../administration/harper-studio/');
            modified = true;
        }
        
        // Component links in release notes are now handled in the section that converts relative paths to absolute paths
        
        // Fix the built-in component link in 4.5 release notes (keep this for other cases)
        if (version === '4.5' && filePath.includes('/release-notes/')) {
            // The original link points to ../../../developers/components/built-in.md
            // It should stay as built-in, not built-in-extensions
            content = content.replace(/\.\.\/\.\.\/\.\.\/technical-details\/reference\/components\/built-in-extensions/g, '../../../developers/components/built-in');
            modified = true;
        }
        
        // Fix getting-started links in 4.5
        if (version === '4.5' && filePath.includes('/getting-started/')) {
            // Fix broken links in what-is-harper.md pointing to non-existent /developers/applications/
            if (filePath.includes('what-is-harper')) {
                // These links should point to first-harper-app.md instead
                content = content.replace(/\.\.\/developers\/applications\/#creating-our-first-table/g, './first-harper-app#creating-our-first-table');
                content = content.replace(/\.\.\/developers\/applications\/#adding-an-endpoint/g, './first-harper-app#adding-an-endpoint');
                content = content.replace(/\.\.\/developers\/applications\/#custom-functionality-with-javascript/g, '../developers/applications/#custom-functionality-with-javascript');
                // Also fix the custom-functions link that was incorrectly changed
                content = content.replace(/\.\.\/developers\/custom-functions/g, '../developers/applications/#custom-functionality-with-javascript');
            }
            
            // Look for the specific table structure and fix the links
            // These appear to be coming from processed HTML table cells
            content = content.replace(/>deployments\/harper-cloud\//g, '>../deployments/harper-cloud/');
            content = content.replace(/>developers\/applications\//g, '>../developers/applications/');
            content = content.replace(/>deployments\/configuration/g, '>../deployments/configuration');
            content = content.replace(/>developers\/rest/g, '>../developers/rest');
            content = content.replace(/>developers\/operations-api\//g, '>../developers/operations-api/');
            
            // Also fix them in markdown links
            content = content.replace(/\]\(deployments\/harper-cloud\//g, '](../deployments/harper-cloud/');
            content = content.replace(/\]\(developers\/applications\//g, '](../developers/applications/');
            content = content.replace(/\]\(deployments\/configuration/g, '](../deployments/configuration');
            content = content.replace(/\]\(developers\/rest/g, '](../developers/rest');
            content = content.replace(/\]\(developers\/operations-api\//g, '](../developers/operations-api/');
            
            // Fix first-harper-app links
            content = content.replace(/\]\(defining-schemas/g, '](../developers/applications/defining-schemas');
            // Fix graphql link to include version
            if (filePath.includes('/first-harper-app')) {
                content = content.replace(/\]\(\.\.\/\.\.\/technical-details\/reference\/graphql\.md\)/g, '](/4.5/technical-details/reference/graphql)');
                content = content.replace(/\]\(\.\.\/\.\.\/technical-details\/reference\/graphql\)/g, '](/4.5/technical-details/reference/graphql)');
            }
            modified = true;
        }
        
        // Fix restarting-server links to harper-studio
        if (filePath.includes('/custom-functions/restarting-server')) {
            // Fix harper-studio path (it's under administration)
            content = content.replace(/\]\(\.\.\/harper-studio\//g, '](../administration/harper-studio/');
            modified = true;
        }
    }
    
    // Fix root-level getting-started.md links for versions that have it in SUMMARY.md
    if ((version === '4.2' || version === '4.3' || version === '4.4') && filePath.endsWith('getting-started.md') && !filePath.includes('/getting-started/')) {
        // These are root-level getting-started.md files that need link fixes
        // Fix deployments links
        if (version === '4.2' || version === '4.3') {
            content = content.replace(/\[HarperDB Cloud\]\(deployments\/harperdb-cloud\//g, '[HarperDB Cloud](./deployments/harperdb-cloud/');
        } else if (version === '4.4') {
            content = content.replace(/\[Harper Cloud\]\(deployments\/harper-cloud\//g, '[Harper Cloud](./deployments/harper-cloud/');
        }
        // Fix developers/applications links
        content = content.replace(/\]\(developers\/applications\//g, '](./developers/applications/');
        modified = true;
    }
    
    if (version === '4.6' || version === 'current') {
        // Fix custom-functions links
        if (filePath.includes('/custom-functions/')) {
            // Fix define-routes links
            content = content.replace(/\]\(define-routes\.md\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(define-routes\)/g, '](../developers/applications/define-routes)');
            content = content.replace(/\]\(\.\/define-routes\)/g, '](../developers/applications/define-routes)');
            // Fix configuration link
            content = content.replace(/\]\(\.\.\/configuration/g, '](../deployments/configuration');
            // Fix manage-functions to manage-applications (file doesn't exist)
            content = content.replace(/\]\(\.\.\/harper-studio\/manage-functions\.md\)/g, '](../administration/harper-studio/manage-applications)');
            content = content.replace(/\]\(\.\.\/harper-studio\/manage-functions\)/g, '](../administration/harper-studio/manage-applications)');
            // Fix harper-studio path (it's under administration)
            content = content.replace(/\]\(\.\.\/harper-studio\//g, '](../administration/harper-studio/');
            modified = true;
        }
        
        // Fix restarting-server links to harper-studio
        if (filePath.includes('/custom-functions/restarting-server')) {
            // Fix harper-studio path (it's under administration)
            content = content.replace(/\]\(\.\.\/harper-studio\//g, '](../administration/harper-studio/');
            modified = true;
        }
        
        // Fix analytics page link - source has wrong path
        if (filePath.includes('/developers/operations-api/analytics')) {
            content = content.replace(/\]\(docs\/developers\/operations-api\/nosql-operations\.md\)/g, '](./nosql-operations)');
            content = content.replace(/\]\(docs\/developers\/operations-api\/nosql-operations\)/g, '](./nosql-operations)');
            content = content.replace(/\]\(developers\/operations-api\/nosql-operations/g, '](./nosql-operations');
            modified = true;
        }
        
        // Fix resources paths
        if (filePath.includes('/technical-details/reference/resources/')) {
            // Fix broken .md link
            content = content.replace(/\]\(\.md\)/g, ']()');
            // Fix resource-migration link - file is actually migration.md
            content = content.replace(/\]\(\.\/resource-migration\.md\)/g, '](./migration)');
            content = content.replace(/\]\(\.\/resource-migration\)/g, '](./migration)');
            // Fix operations-api link - need to go up 3 levels not 2
            content = content.replace(/\]\(\.\.\/\.\.\/developers\/operations-api\//g, '](../../../developers/operations-api/');
            content = content.replace(/\]\(\.\.\/\.\.\/\.\.\/\.\.\/developers\/operations-api\//g, '](../../../../developers/operations-api/');
            modified = true;
        }
        
        // Fix google-data-studio links
        if (filePath.includes('/developers/miscellaneous/google-data-studio')) {
            // In 4.6, harper-studio is under administration
            content = content.replace(/\]\(\.\.\/\.\.\/administration\/harperdb-studio\//g, '](../../administration/harper-studio/');
            content = content.replace(/\]\(\.\.\/\.\.\/administration\/harper-studio\//g, '](../../administration/harper-studio/');
            modified = true;
        }
        
        // Alarms links should work correctly with harper-studio name
    }
    
    // Add general fixes for all versions >= 4.1
    if (version && parseFloat(version) >= 4.1) {
        // Fix broken-reference links (these should be removed as they're GitBook artifacts)
        content = content.replace(/\]\(broken-reference\)/g, '');
        
        // Fix getting-started/getting-started patterns BEFORE adding ./ prefix
        // These patterns should just be getting-started/
        // Match the pattern anywhere in the link, not just in parentheses
        content = content.replace(/getting-started\/getting-started\.md/g, 'getting-started/');
        content = content.replace(/getting-started\/getting-started(?![-\w])/g, 'getting-started/');
        
        // Fix logging links in administration/logging index files BEFORE adding ./ prefix
        if (filePath.includes('/administration/logging/') && (filePath.endsWith('/index.md') || filePath.endsWith('/README.md'))) {
            content = content.replace(/\]\(logging\.md\)/g, '](standard-logging.md)');
            content = content.replace(/\]\(logging\)/g, '](standard-logging)');
            modified = true;
        }
        
        // Fix relative paths that don't start with ./ or ../ or / or http
        // This ensures all relative links are properly formatted for Docusaurus
        content = content.replace(/\]\(([^.\/\#\)][^:)]*)\)/g, (match, path) => {
            // Skip if it's an external link or anchor
            if (path.includes('://') || path.startsWith('http')) {
                return match;
            }
            modified = true;
            return `](./${path})`;
        });
        
        // Fix double administration paths
        content = content.replace(/\/administration\/administration\//g, '/administration/');
        content = content.replace(/\.\.\/administration\/administration\//g, '../administration/');
        content = content.replace(/\.\.\/\.\.\/\.\.\/administration\/administration\//g, '../../../administration/');
        
        // Fix cross-version release notes links that don't exist
        if (filePath.includes('/release-notes/') && filePath.includes('/4.1.0') || filePath.includes('/4.2.0')) {
            // Remove links to pages that don't exist in older versions
            content = content.replace(/\]\([^)]*\/developers\/security\/configuration[^)]*\)/g, 'security configuration');
            content = content.replace(/\]\([^)]*\/administration\/logging[^)]*\)/g, 'logging');
        }
        
        // Fix release notes paths
        if (filePath.includes('/technical-details/release-notes/')) {
            content = content.replace(/\.\.\/\.\.\/release-notes\//g, '../../technical-details/release-notes/');
            
            // Fix component links to point to the correct version's documentation
            // 4.2.0 release notes should link to 4.2 docs, 4.5.0 to 4.5 docs, etc.
            if (filePath.includes('/4.2.0')) {
                // Link to 4.2 docs where components directory exists (with or without trailing slash)
                content = content.replace(/\]\(\.\.\/\.\.\/\.\.\/developers\/components\/?\)/g, '](/4.2/developers/components)');
            }
            // For 4.5.0 release notes, fix the built-in component link
            // This appears in multiple versions, so we need to fix it everywhere
            if (filePath.includes('/4.5.0')) {
                // Replace all variations of the built-in link to point to 4.5 docs
                // Handle both with and without .md extension
                content = content.replace(/\]\(\.\.\/\.\.\/\.\.\/developers\/components\/built-in(?:\.md)?\)/g, '](/4.5/developers/components/built-in)');
                modified = true;
            }
            // For older versions (4.2-4.5), the links within their own version are fine as-is
            
            // For other component paths with specific files (keep absolute paths for cross-version links)
            content = content.replace(/\.\.\/\.\.\/developers\/components\//g, `/docs/${version}/developers/components/`);
            content = content.replace(/\.\.\/\.\.\/developers\/applications\//g, `/docs/${version}/developers/applications/`);
            content = content.replace(/\.\.\/\.\.\/developers\/real-time/g, `/docs/${version}/developers/real-time`);
            content = content.replace(/\.\.\/\.\.\/developers\/rest/g, `/docs/${version}/developers/rest`);
            content = content.replace(/\.\.\/\.\.\/administration\//g, `/docs/${version}/administration/`);
            
            // Fix broken administration links
            content = content.replace(/\.\.\/\.\.\/\.\.\/administration\/administration\//g, `/docs/${version}/administration/`);
            
            // Fix cross-version release notes links - these reference specific features in specific versions
            // For 4.2.0 release notes
            if (filePath.includes('/4.2.0')) {
                // Components don't exist in 4.2 or 4.3, they were introduced in 4.6
                // Update these links to point to 4.6 where the documentation actually exists
                content = content.replace(/\/docs\/4\.2\/technical-details\/reference\/components\//g, '/4.6/technical-details/reference/components/');
                content = content.replace(/\/docs\/4\.3\/technical-details\/reference\/components\/extensions/g, '/4.6/technical-details/reference/components/extensions');
            }
            
            // For 4.3.0 release notes
            if (filePath.includes('/4.3.0')) {
                // harper-cli moved to deployments
                content = content.replace(/\/docs\/4\.3\/deployments\/harper-cli/g, '/4.3/deployments/harperdb-cli');
            }
            
            // For 4.5.0 release notes
            if (filePath.includes('/4.5.0')) {
                // built-in-extensions doesn't exist in 4.5
                content = content.replace(/\/docs\/4\.5\/technical-details\/reference\/components\/built-in-extensions/g, '/4.6/technical-details/reference/components/built-in-extensions');
            }
            
            modified = true;
        }
        
        // Fix deployments configuration links
        if (content.includes('../../../deployments/configuration')) {
            content = content.replace(/\.\.\/\.\.\/\.\.\/deployments\/configuration/g, `/docs/${version}/deployments/configuration`);
            modified = true;
        }
        
        // Fix security links
        if (content.includes('../../../security/')) {
            content = content.replace(/\.\.\/\.\.\/\.\.\/security\/basic-auth/g, `/docs/${version}/developers/security/basic-auth`);
            content = content.replace(/\.\.\/\.\.\/\.\.\/security\/jwt-auth/g, `/docs/${version}/developers/security/jwt-auth`);
            modified = true;
        }
        
        // Fix defining-schemas links specifically
        if (filePath.includes('/developers/applications/') && filePath.includes('defining-schemas')) {
            content = content.replace(/\.\.\/developers\/applications\/dynamic-schema/g, './dynamic-schema');
            modified = true;
        }
        
        // Fix links from other applications files
        if (filePath.includes('/developers/applications/') && !filePath.includes('defining-schemas')) {
            content = content.replace(/\.\.\/\.\.\/developers\/applications\/defining-schemas/g, './defining-schemas');
            modified = true;
        }
    }
    
    // Handle feature availability
    if (config.featureAvailability) {
        // Remove links to features not available in this version
        if (!config.featureAvailability.harperCloud) {
            // Remove harper-cloud links
            const harperCloudPattern = /\[([^\]]+)\]\([^)]*harper-cloud[^)]*\)/g;
            if (content.match(harperCloudPattern)) {
                content = content.replace(harperCloudPattern, '$1');
                modified = true;
            }
        }
        
        if (config.featureAvailability.resources === false) {
            // Remove links to resources feature that doesn't exist in this version
            const resourcesPattern = /\[([^\]]+)\]\([^)]*\/reference\/resources[^)]*\)/g;
            if (content.match(resourcesPattern)) {
                content = content.replace(resourcesPattern, '$1');
                modified = true;
            }
        }
    }
    
    // Apply custom fixes
    if (config.customFixes) {
        if (config.customFixes.removeSecurityLinks && filePath.includes('SUMMARY.md')) {
            // Remove broken security links for version 4.1
            const securityPattern = /\[([^\]]+)\]\([^)]*security\/[^)]+\)/g;
            if (content.match(securityPattern)) {
                content = content.replace(securityPattern, '$1');
                modified = true;
            }
        }
        
        if (config.customFixes.fixConfigurationPath) {
            // In version 4.1, configuration is at root level, not in deployments
            const configPattern = /\]\(\.\.\/deployments\/configuration/g;
            if (content.match(configPattern)) {
                content = content.replace(configPattern, '](../configuration');
                modified = true;
            }
        }
        
        if (config.customFixes.removeIndividualReleaseNotes && filePath.includes('/release-notes/index.md')) {
            // Remove individual release note links for current version
            const lines = content.split('\n');
            const filteredLines = lines.filter(line => {
                return !line.match(/\[[^\]]+\]\(\.\/\d+\.\w+\/\d+\.\d+(?:\.\d+)?\)/);
            });
            
            if (filteredLines.length !== lines.length) {
                content = filteredLines.join('\n');
                modified = true;
            }
        }
    }
    
    return { content, modified };
}

/**
 * Process release notes with special handling
 */
function processReleaseNotes(content, filePath, version) {
    if (!filePath.includes('/release-notes/')) {
        return { content, modified: false };
    }
    
    let modified = false;
    
    // Fix component links in release notes to point to the correct version
    if (filePath.includes('/4.2.0')) {
        // Link to 4.2 docs where components directory exists
        content = content.replace(/\]\(\.\.\/\.\.\/\.\.\/developers\/components\/?\)/g, '](/4.2/developers/components)');
        modified = true;
    }
    // The 4.5.0 built-in link fix is now handled in applyVersionSpecificFixes
    // No need to duplicate it here
    
    // Fix "Meet Tucker/Monkey/Penny/Alby" directory links
    const meetPupDirLinks = /\[Meet (Tucker|Monkey|Penny|Alby)\]\(\.\/(\d+\.\w+)\/\)/gi;
    if (content.match(meetPupDirLinks)) {
        content = content.replace(meetPupDirLinks, (match, pupName, versionDir) => {
            return `[Meet ${pupName}](./${versionDir}/index)`;
        });
        modified = true;
    }
    
    // For versioned docs, remove links to future releases
    if (version && version !== 'current' && filePath.endsWith('/index.md')) {
        const currentVersion = parseFloat(version);
        const lines = content.split('\n');
        const filteredLines = [];
        
        for (const line of lines) {
            const releaseMatch = line.match(/\[([^\]]+)\]\([^)]*\/(\d+\.\d+(?:\.\d+)?)\)?/);
            if (releaseMatch) {
                const linkedVersion = parseFloat(releaseMatch[2]);
                if (linkedVersion <= currentVersion) {
                    filteredLines.push(line);
                }
            } else {
                filteredLines.push(line);
            }
        }
        
        if (filteredLines.length !== lines.length) {
            content = filteredLines.join('\n');
            modified = true;
        }
    }
    
    return { content, modified };
}

/**
 * Apply comprehensive link fixes
 */
function fixLinks(content, filePath, version) {
    let modified = false;
    
    // Fix anchor formatting - GitBook uses mixed case, Docusaurus uses lowercase
    // Match links with anchors
    content = content.replace(/(\[[^\]]*\]\([^)#]*)#([^)]+)\)/g, (match, linkPart, anchor) => {
        // Convert anchor to lowercase (Docusaurus format)
        const newAnchor = anchor.toLowerCase();
        modified = true;
        return `${linkPart}#${newAnchor})`;
    });
    
    // Apply global link patterns
    for (const [from, to] of Object.entries(LINK_PATTERNS.global)) {
        if (content.includes(from)) {
            content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
            modified = true;
        }
    }
    
    // Apply path-specific patterns
    for (const [pathPattern, replacements] of Object.entries(LINK_PATTERNS.byPath)) {
        if (filePath.includes(pathPattern)) {
            for (const [from, to] of Object.entries(replacements)) {
                const linkPattern = new RegExp(`\\[([^\\]]+)\\]\\(${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^)]*)\\)`, 'g');
                if (content.match(linkPattern)) {
                    content = content.replace(linkPattern, `[$1](${to}$2)`);
                    modified = true;
                }
            }
        }
    }
    
    // Remove broken links
    const allBrokenLinks = [...BROKEN_LINKS.global];
    if (version && BROKEN_LINKS.byVersion[version]) {
        allBrokenLinks.push(...BROKEN_LINKS.byVersion[version]);
    }
    
    for (const brokenLink of allBrokenLinks) {
        const pattern = new RegExp(`\\[([^\\]]+)\\]\\([^)]*${brokenLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^)]*\\)`, 'g');
        if (content.match(pattern)) {
            content = content.replace(pattern, '$1');
            modified = true;
        }
    }
    
    // If this is the logging index.md or README.md, update the link to standard-logging.md
    if ((path.basename(filePath) === 'index.md' || path.basename(filePath) === 'README.md') && path.dirname(filePath).endsWith('/logging')) {
        // Match any variation of the logging.md link with different list markers
        const loggingLinkPattern = /([-*]\s*)?\[([^\]]+)\]\(logging\.md\)/g;
        if (content.match(loggingLinkPattern)) {
            content = content.replace(loggingLinkPattern, (match, listMarker, linkText) => {
                const marker = listMarker || '';
                modified = true;
                return `${marker}[${linkText}](standard-logging.md)`;
            });
        }
        // Also handle the case where .md was already removed and ./ was added
        content = content.replace(/\]\(\.\/logging\)/g, '](./standard-logging)');
        // And handle case where just 'logging' without .md
        content = content.replace(/\]\(logging\)/g, '](standard-logging)');
    }
    
    // Fix links to logging/logging.md throughout all files (should be logging/standard-logging.md)
    const loggingPathPattern = /(\[[^\]]+\]\()([^)]*\/)?logging\/logging\.md([^)]*\))/g;
    if (content.match(loggingPathPattern)) {
        content = content.replace(loggingPathPattern, (match, prefix, path, suffix) => {
            modified = true;
            return `${prefix}${path || ''}logging/standard-logging.md${suffix}`;
        });
    }
    
    // Remove .md extensions from internal links - comprehensive fix
    // This handles all markdown link patterns with .md extensions
    content = content.replace(/(\[[^\]]+\]\()([^)]+\.md)([\)#])/g, (match, prefix, pathWithExt, suffix) => {
        // Only process if it's not an external link
        if (!pathWithExt.includes('http://') && !pathWithExt.includes('https://')) {
            modified = true;
            // Remove the .md extension
            const pathWithoutExt = pathWithExt.replace(/\.md$/, '');
            return prefix + pathWithoutExt + suffix;
        }
        return match;
    });
    
    // Remove /docs/ prefix from versioned links since routeBasePath is now '/'
    // This fixes links like /docs/4.2/... to just /4.2/...
    content = content.replace(/(\[[^\]]+\]\()\/docs\/(4\.[0-9]+\/[^)]+\))/g, (match, prefix, versionPath) => {
        modified = true;
        return prefix + '/' + versionPath;
    });
    
    // Also handle .md extensions in HTML links within tables (GitBook specific)
    // This pattern catches href attributes in <a> tags
    content = content.replace(/(<a\s+[^>]*href=")([^"]+\.md)(")/g, (match, prefix, pathWithExt, suffix) => {
        // Only process if it's not an external link
        if (!pathWithExt.includes('http://') && !pathWithExt.includes('https://')) {
            modified = true;
            // Remove the .md extension
            const pathWithoutExt = pathWithExt.replace(/\.md$/, '');
            return prefix + pathWithoutExt + suffix;
        }
        return match;
    });
    
    return { content, modified };
}

/**
 * Main conversion function
 */
function convertFile(filePath, targetPath, docsDir, outputDir, options = {}) {
    const displayPath = outputDir ? path.relative(docsDir, filePath) : filePath;
    console.log(`Converting: ${displayPath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let totalModified = false;
    
    const version = options.version;
    
    // Skip SUMMARY.md files
    if (path.basename(filePath) === 'SUMMARY.md') {
        console.log(`  Skipping SUMMARY.md (GitBook artifact)`);
        return;
    }
    
    // Apply conversions in order
    let result;
    
    // 1. GitBook syntax conversion
    result = convertGitBookSyntax(content);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 2. MDX syntax fixes
    result = fixMDXSyntax(content, filePath);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 3. Image path fixes
    result = fixImagePaths(content, version);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 4. Version-specific fixes FIRST (before general fixes)
    result = applyVersionSpecificFixes(content, filePath, version);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 5. General link fixes (after version-specific)
    result = fixLinks(content, filePath, version);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 6. Release notes processing
    result = processReleaseNotes(content, filePath, version);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 7. Fix broken links from GitBook to Docusaurus (final cleanup)
    result = fixBrokenLinks(content, filePath, version);
    content = result.content;
    totalModified = totalModified || result.modified;
    
    // 8. Fix links to numbered directories (they get renamed to avoid webpack issues)
    // Convert links like 1.alby/ to v1-alby/
    const numberedDirPattern = /(\[[^\]]+\]\()(\d+\.(alby|penny|monkey|tucker))(\/[^)]*)?(\))/g;
    if (content.match(numberedDirPattern)) {
        content = content.replace(numberedDirPattern, (match, prefix, dirName, pupName, pathSuffix, suffix) => {
            const newDirName = 'v' + dirName.replace('.', '-');
            return `${prefix}${newDirName}${pathSuffix || ''}${suffix}`;
        });
        totalModified = true;
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
            console.log(`  Renaming logging.md to standard-logging.md to avoid route conflict`);
            fs.renameSync(filePath, newPath);
            filePath = newPath;
        }
    }
    
    // Handle file renaming (README.md -> index.md)
    if (path.basename(filePath) === 'README.md' && targetPath) {
        const dir = path.dirname(targetPath);
        targetPath = path.join(dir, 'index.md');
        console.log(`  Renaming README.md to index.md`);
    } else if (path.basename(filePath) === 'README.md') {
        const newPath = path.join(path.dirname(filePath), 'index.md');
        fs.renameSync(filePath, newPath);
        filePath = newPath;
        console.log(`  Renamed README.md to index.md`);
    }
    
    // Add or update frontmatter
    const frontmatterResult = addOrUpdateFrontmatter(content, filePath, version);
    content = frontmatterResult.content;
    totalModified = totalModified || frontmatterResult.modified;
    
    // Write the file
    if (targetPath) {
        fs.writeFileSync(targetPath, content);
        console.log(`  ✓ Converted to: ${path.relative(outputDir, targetPath)}`);
    } else if (totalModified) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Updated in place`);
    } else {
        console.log(`  No changes needed`);
    }
}

/**
 * Extract title from content
 */
function extractTitle(content, filePath) {
    // Try to extract from first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
        return h1Match[1].replace(/`/g, '');
    }
    
    // Fall back to filename
    const basename = path.basename(filePath, '.md');
    return basename
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Fix broken links after GitBook to Docusaurus conversion
 */
function fixBrokenLinks(content, filePath, version) {
    let modified = false;
    
    // CATEGORY 1: Fix double version paths (e.g., /docs/4.2/4.2/)
    // This happens when version is incorrectly inserted twice
    // Fix ALL double version patterns, not just the current version
    const anyDoubleVersionPattern = /\/docs\/(4\.\d+)\/\1\//g;
    if (content.match(anyDoubleVersionPattern)) {
        content = content.replace(anyDoubleVersionPattern, '/docs/$1/');
        modified = true;
    }
    
    // CATEGORY 2: Fix absolute harperdb-studio links that should be relative
    // In version 4.1, harperdb-studio is at root level
    // In other versions, it might be under administration
    if (version === '4.1' && filePath.includes('/custom-functions/')) {
        content = content.replace(/\/docs\/4\.1\/harperdb-studio\/index/g, '../harperdb-studio/');
        content = content.replace(/\/docs\/4\.1\/harperdb-studio\//g, '../harperdb-studio/');
        modified = true;
    }
    
    // CATEGORY 3: Fix malformed relative paths with ./docs/ or ../../docs/
    // These are never correct - docs should not appear in relative paths
    content = content.replace(/\.\.\/\.\.\/\.\/docs\//g, '../../');
    content = content.replace(/\.\.\/\.\/docs\//g, '../');
    content = content.replace(/\.\/docs\//g, './');
    content = content.replace(/\.\.\/\.\.\//g, '../../');  // Fix ../../ to ../../
    if (content.includes('./docs/') || content.includes('../docs/')) {
        modified = true;
    }
    
    // CATEGORY 4: Fix double slashes in paths (..// should be ../)
    content = content.replace(/\.\.\/\//g, '../');
    content = content.replace(/\/\//g, '/');
    if (content.includes('..//') || content.includes('//')) {
        modified = true;
    }
    
    // PHASE 1 FIX: Remove index from links (56 instances)
    // Links to index files should link to directories instead
    content = content.replace(/\/index(?:\.md)?(?=\)|#)/g, '/');
    content = content.replace(/\](\([^)]+)\/index\)/g, ']$1/)');
    // Also fix bare index links
    content = content.replace(/\]\(index\)/g, '](/)');
    content = content.replace(/\]\(\.\/index\)/g, '](/)');
    content = content.replace(/\]\(\.\.\/([^)]+)\/index\)/g, '](../$1/)');
    
    // PHASE 1 FIX: Harper Studio naming consistency
    // Version-specific studio naming and location
    // IMPORTANT: Directory naming changed in 4.4:
    // - 4.1, 4.2, 4.3: harperdb-studio
    // - 4.4, 4.5, 4.6: harper-studio
    if (version === '4.1' || version === '4.2' || version === '4.3') {
        // 4.1-4.3 use harperdb-studio
        content = content.replace(/harper-studio/g, 'harperdb-studio');
    }
    // For 4.4+ keep harper-studio as is (it's the correct name)
    
    // FIX: Cross-version references in release notes
    // When in versioned docs, fix references like ../docs/4.2/... to proper relative paths
    if (version && filePath.includes('/release-notes/')) {
        // Fix patterns like ../docs/4.2/deployments/configuration
        const crossVersionPattern = new RegExp(`\\.\\./docs/${version}/`, 'g');
        content = content.replace(crossVersionPattern, '../../../');
        
        // Fix patterns like ../../docs/4.2/administration/logging
        const crossVersionPattern2 = new RegExp(`\\.\\./\\.\\./docs/${version}/`, 'g');
        content = content.replace(crossVersionPattern2, '../../../../');
    }
    
    // FIX: Resource vs Resources naming
    // Pre-4.6 uses "resource" (singular), 4.6+ uses "resources" (plural)
    if (version && parseFloat(version) < 4.6) {
        // Fix references to technical-details/reference/resources -> resource
        content = content.replace(/\/technical-details\/reference\/resources/g, '/technical-details/reference/resource');
        content = content.replace(/\/reference\/resources(?!\.)/g, '/reference/resource');
        
        // Fix relative paths
        content = content.replace(/\.\.\/reference\/resources/g, '../reference/resource');
        content = content.replace(/\.\.\/\.\.\/reference\/resources/g, '../../reference/resource');  
        content = content.replace(/\.\.\/\.\.\/\.\.\/reference\/resources/g, '../../../reference/resource');
        
        // But keep "resources" in text and other contexts (not links)
    }
    
    // CATEGORY 5: Fix specific version patterns
    if (version) {
        // Fix clustering links
        content = content.replace(new RegExp(`/docs/${version}/clustering/index`, 'g'), `/docs/${version}/clustering/`);
        
        // Fix harperdb-studio links for different versions
        if (parseFloat(version) >= 4.2 && parseFloat(version) <= 4.5) {
            // In these versions, studio is under administration
            if (filePath.includes('/custom-functions/')) {
                content = content.replace(/\.\.\/harperdb-studio/g, '../administration/harperdb-studio');
                content = content.replace(new RegExp(`/docs/${version}/harperdb-studio/`, 'g'), `/docs/${version}/administration/harperdb-studio/`);
            }
        }
    }
    
    // Common link patterns that need fixing
    const linkFixes = [
        // Fix links to /docs/latest/developers/
        { pattern: /\/docs\/latest\/developers\//g, replacement: '/docs/developers/' },
        
        // Fix bare index links
        { pattern: /\]\(index\)/g, replacement: '](./)' },
        
        // Fix links with .md extension
        { pattern: /\(([^)]+)\.md\)/g, replacement: '($1)' },
        
        // Fix links to numbered directories (release notes)
        { pattern: /\/([1-4])\.(alby|penny|monkey|tucker)\//g, replacement: (match, num, name) => {
            return `/v${num}-${name}/`;
        }},
    ];
    
    // Apply all link fixes
    for (const fix of linkFixes) {
        if (content.match(fix.pattern)) {
            content = content.replace(fix.pattern, fix.replacement);
            modified = true;
        }
    }
    
    // Fix versioned links if we're in a versioned docs directory
    if (version && version !== 'latest') {
        // Update absolute links to include version, but skip if already versioned
        // This regex skips links that already have a version number (4.x)
        const versionedLinkPattern = /\(\/docs\/(?!latest\/)(?!4\.\d+\/)([^)]+)\)/g;
        if (content.match(versionedLinkPattern)) {
            content = content.replace(versionedLinkPattern, (match, path) => {
                // Don't add version if path already starts with the version
                if (path.startsWith(`${version}/`)) {
                    return `(/docs/${path})`;
                }
                return `(/docs/${version}/${path})`;
            });
            modified = true;
        }
    }
    
    return { content, modified };
}

/**
 * Add or update frontmatter
 */
function addOrUpdateFrontmatter(content, filePath, version) {
    let modified = false;
    const title = extractTitle(content, filePath);
    
    // Check if content already has frontmatter
    if (content.startsWith('---')) {
        // Update existing frontmatter if needed
        const frontmatterEndIndex = content.indexOf('---', 3);
        if (frontmatterEndIndex > 0) {
            const frontmatter = content.substring(0, frontmatterEndIndex + 3);
            const restContent = content.substring(frontmatterEndIndex + 3);
            
            // Check if title exists
            if (!frontmatter.includes('title:')) {
                const updatedFrontmatter = frontmatter.replace('---\n', `---\ntitle: ${title}\n`);
                content = updatedFrontmatter + restContent;
                modified = true;
            }
        }
    } else {
        // Add frontmatter
        let frontmatterFields = { title };
        
        // Add sidebar position for certain files
        if (filePath.includes('/release-notes/')) {
            const pathParts = filePath.split(path.sep);
            const releaseNotesIndex = pathParts.indexOf('release-notes');
            
            if (releaseNotesIndex >= 0 && releaseNotesIndex < pathParts.length - 2) {
                const versionDir = pathParts[releaseNotesIndex + 1];
                const filename = path.basename(filePath, '.md');
                
                // Special handling for index files
                if (filename === 'index') {
                    if (versionDir && versionDir.match(/^\d+\./)) {
                        // Version directory index (e.g., 4.tucker/index.md)
                        frontmatterFields.sidebar_position = 99999;
                    } else {
                        // Main release notes index
                        frontmatterFields.sidebar_position = 0;
                    }
                } else if (filename.match(/^\d+\.\d+(\.\d+)?$/)) {
                    // Individual release notes (e.g., 4.1.0.md)
                    const versionParts = filename.split('.').map(Number);
                    const versionScore = versionParts[0] * 10000 + (versionParts[1] || 0) * 100 + (versionParts[2] || 0);
                    frontmatterFields.sidebar_position = 99999 - versionScore;
                }
            }
        }
        
        // Build frontmatter string
        let frontmatter = '---\n';
        for (const [key, value] of Object.entries(frontmatterFields)) {
            frontmatter += `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}\n`;
        }
        frontmatter += '---\n\n';
        
        content = frontmatter + content;
        modified = true;
    }
    
    return { content, modified };
}

/**
 * Create a category file for directories that need auto-generated index pages
 */
function createCategoryFile(dirPath, targetDirPath) {
    // Directories that should have auto-generated index pages
    const categoriesNeeded = {
        'developers': {
            label: 'Developers',
            description: 'Comprehensive guides and references for building applications with HarperDB'
        },
        'administration': {
            label: 'Administration',
            description: 'Guides for managing and administering HarperDB instances'
        },
        'deployments': {
            label: 'Deployments',
            description: 'Installation and deployment guides for HarperDB'
        },
        'technical-details': {
            label: 'Technical Details',
            description: 'Reference documentation and technical specifications'
        }
    };
    
    const dirName = path.basename(dirPath);
    
    // Check if this directory needs a category file and doesn't have an index.md
    if (categoriesNeeded[dirName]) {
        const indexPath = path.join(targetDirPath || dirPath, 'index.md');
        const categoryPath = path.join(targetDirPath || dirPath, '_category_.json');
        
        // Only create category file if there's no index.md
        if (!fs.existsSync(indexPath)) {
            const categoryConfig = {
                label: categoriesNeeded[dirName].label,
                position: Object.keys(categoriesNeeded).indexOf(dirName) + 1,
                link: {
                    type: 'generated-index',
                    title: `${categoriesNeeded[dirName].label} Documentation`,
                    description: categoriesNeeded[dirName].description,
                    keywords: [dirName.toLowerCase()]
                }
            };
            
            fs.writeFileSync(categoryPath, JSON.stringify(categoryConfig, null, 2));
            console.log(`  Created category file for ${dirName}`);
        }
    }
}

/**
 * Process directory recursively
 */
function processDirectory(dirPath, targetDirPath, docsDir = dirPath, outputDir = targetDirPath, options = {}) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Skip empty directories
    const hasContent = entries.some(entry => 
        (entry.isFile() && !entry.name.startsWith('.')) || 
        (entry.isDirectory() && !entry.name.startsWith('.'))
    );
    
    if (!hasContent) {
        console.log(`  Skipping empty directory: ${dirPath}`);
        return;
    }
    
    // Create target directory
    if (targetDirPath) {
        fs.mkdirSync(targetDirPath, { recursive: true });
    }
    
    // Create category file if needed
    createCategoryFile(dirPath, targetDirPath);
    
    // Check if we have both index.md and README.md, and prefer README if index is blank
    const hasIndex = entries.some(e => e.name === 'index.md');
    const hasReadme = entries.some(e => e.name === 'README.md');
    
    if (hasIndex && hasReadme) {
        const indexPath = path.join(dirPath, 'index.md');
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Check if index.md is essentially blank (contains only the comment about blank index)
        if (indexContent.includes('blank index file needed to avoid "index" being added to URLs') || 
            indexContent.trim().length < 50) {
            // Remove the blank index.md so README.md will be used instead
            fs.unlinkSync(indexPath);
            console.log(`  Removed blank index.md in favor of README.md in ${dirPath}`);
        }
    }
    
    // Process entries
    for (const entry of entries) {
        let entryName = entry.name;
        let actualSourcePath = path.join(dirPath, entry.name);
        
        // Skip if this was the blank index.md we just removed
        if (!fs.existsSync(actualSourcePath)) {
            continue;
        }
        
        // Fix directories starting with numbers (webpack issue)
        // Rename them to prefix with 'v' (e.g., '1.alby' -> 'v1-alby')
        if (entry.isDirectory() && /^\d/.test(entry.name)) {
            const newName = 'v' + entry.name.replace('.', '-');
            if (targetDirPath) {
                // When outputting to different directory, use new name for target only
                console.log(`  Renaming directory ${entry.name} to ${newName} to avoid webpack issues`);
                entryName = newName;
                // Source path remains the same
            } else {
                // When converting in place, rename the actual directory
                const oldPath = path.join(dirPath, entry.name);
                const newPath = path.join(dirPath, newName);
                if (!fs.existsSync(newPath)) {
                    fs.renameSync(oldPath, newPath);
                    console.log(`  Renamed directory ${entry.name} to ${newName}`);
                    entryName = newName;
                    actualSourcePath = newPath;
                } else {
                    entryName = newName;
                    actualSourcePath = newPath;
                }
            }
        }
        
        const targetPath = targetDirPath 
            ? path.join(targetDirPath, entryName)
            : null;
        
        if (entry.isDirectory()) {
            // Skip custom-functions directory for versions 4.2+ (doesn't exist in live docs, use redirects)
            // But keep it for version 4.1 which needs it for its sidebar
            if (entry.name === 'custom-functions' && options?.version && options.version !== '4.1') {
                console.log(`  Skipping custom-functions directory for version ${options.version} (will use redirects instead)`);
                continue;
            }
            processDirectory(actualSourcePath, targetPath, docsDir, outputDir, options);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            convertFile(actualSourcePath, targetPath, docsDir, outputDir, options);
        }
    }
}

/**
 * Extract version from path (e.g., "version-4.2" -> "4.2")
 */
function extractVersion(dirPath) {
    const match = dirPath.match(/version-(\d+\.\d+)/);
    return match ? match[1] : null;
}

// Export for use as module
module.exports = { processDirectory, convertFile };

// Run if called directly
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error('Usage: node convert-gitbook-to-docusaurus.js <input-dir> [output-dir]');
        process.exit(1);
    }
    
    const inputDir = path.resolve(args[0]);
    const outputDir = args[1] ? path.resolve(args[1]) : null;
    
    if (!fs.existsSync(inputDir)) {
        console.error(`Input directory does not exist: ${inputDir}`);
        process.exit(1);
    }
    
    if (outputDir && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`Converting GitBook docs to Docusaurus format...`);
    console.log(`Input: ${inputDir}`);
    console.log(`Output: ${outputDir || 'In-place'}`);
    console.log('');
    
    processDirectory(inputDir, outputDir);
    
    console.log('\nConversion complete!');
}