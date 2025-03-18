import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

// Get correct paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../frontend/src/pages');
const outputDir = path.join(__dirname, '../static');

// Ensure the output directory exists
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Generating static files...');

// Function to render a page and save it as HTML
const generatePage = async (pageName) => {
    try {
        const pagePath = pathToFileURL(path.join(pagesDir, `${pageName}.jsx`)).href;
        const { default: PageComponent } = await import(pagePath); // Import `.jsx` dynamically

        const html = renderToStaticMarkup(React.createElement(PageComponent));

        const filePath = path.join(outputDir, `${pageName}.html`);
        writeFileSync(filePath, `<!DOCTYPE html><html><head><title>${pageName}</title></head><body>${html}</body></html>`);

        console.log(`✅ Generated: ${filePath}`);
    } catch (error) {
        console.error(`❌ Error importing ${pageName}.jsx:`, error);
    }
};

// List of static pages to generate
const pages = ['home', 'about']; // Add more pages as needed

pages.forEach(generatePage);

console.log('✅ Static pages generated successfully!');
