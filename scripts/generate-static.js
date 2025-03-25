import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
require('@babel/register')({
  extensions: ['.js', '.jsx'],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../frontend/src/pages');
const outputDir = path.join(__dirname, '../static');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Generating static files...');

const generatePage = async (pageName) => {
  try {
    const pagePath = path.join(pagesDir, `${pageName}.jsx`);
    const { default: PageComponent } = await import(pathToFileURL(pagePath).href);

    const html = renderToStaticMarkup(React.createElement(PageComponent));

    const filePath = path.join(outputDir, `${pageName}.html`);
    writeFileSync(filePath, `<!DOCTYPE html><html><head><title>${pageName}</title></head><body>${html}</body></html>`);

    console.log(`✅ Generated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error importing ${pageName}.jsx:`, error);
  }
};

const pages = ['home', 'about'];

pages.forEach(generatePage);

console.log('✅ Static pages generated successfully!');
