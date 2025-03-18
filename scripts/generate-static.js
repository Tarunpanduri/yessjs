import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define metadata for SEO
const pageMetadata = {
  index: {
    title: 'Home - My Static Site',
    description: 'Welcome to our static website built with React and Vite.',
    keywords: 'home, static site, react, vite',
  },
  about: {
    title: 'About Us - My Static Site',
    description: 'Learn more about our company and what we do.',
    keywords: 'about us, company, information',
  },
  contact: {
    title: 'Contact Us - My Static Site',
    description: 'Get in touch with us via email or phone.',
    keywords: 'contact, email, phone',
  },
};

// Define pages dynamically
const pagesDir = path.resolve(__dirname, '../frontend/src/pages'); // Adjust path
const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.jsx'));

const pages = await Promise.all(
  pageFiles.map(async (file) => {
    const name = file.replace('.jsx', '');
    const filePath = path.join(pagesDir, file); // Get absolute path
    const fileUrl = pathToFileURL(filePath).href; // Convert to file URL

    try {
      const module = await import(fileUrl);
      return {
        name,
        component: module.default,
        outputPath: file === 'index.jsx' ? 'index.html' : `${name}.html`,
        metadata: pageMetadata[name] || {
          title: 'Default Title - My Static Site',
          description: 'This is a default description for a page.',
          keywords: 'default, static, website',
        },
      };
    } catch (error) {
      console.error(`❌ Error importing ${file}:`, error);
      return null;
    }
  })
);

// Filter out failed imports
const validPages = pages.filter(Boolean);

const buildDir = path.resolve(__dirname, '../dist'); // Match Vite's output

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

validPages.forEach(({ component, outputPath, metadata }) => {
  const html = renderToString(React.createElement(component));
  const fullPath = path.join(buildDir, outputPath);

  fs.writeFileSync(
    fullPath,
    `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}" />
      <meta name="keywords" content="${metadata.keywords}" />
      <meta property="og:title" content="${metadata.title}" />
      <meta property="og:description" content="${metadata.description}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://example.com/${outputPath}" />
    </head>
    <body>
      <div id="root">${html}</div>
      <script type="module" src="/src/index.jsx"></script>
    </body>
  </html>`
  );
});

console.log('✅ Static pages generated successfully with SEO optimization!');
