import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Define pages dynamically, using .jsx
const pagesDir = path.resolve(__dirname, '../'); // Adjust path
const buildDir = path.resolve(__dirname, '../frontend/dist'); // Match Vite's output

// Ensure output directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Read all .jsx files from pages directory
const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.jsx'));

const generateStaticPages = async () => {
  for (const file of pageFiles) {
    const name = file.replace('.jsx', '');
    const outputPath = name === 'index' ? 'index.html' : `${name}.html`;
    const metadata = pageMetadata[name] || {
      title: 'Default Title - My Static Site',
      description: 'This is a default description for a page.',
      keywords: 'default, static, website',
    };

    try {
      // Import component dynamically
      const filePath = `file://${path.resolve(pagesDir, file)}`;
      const module = await import(filePath);
      const Component = module.default;

      // Render the React component to a string
      const html = renderToString(React.createElement(Component));

      // Build the final HTML output
      const fullHtml = `<!DOCTYPE html>
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
      </html>`;

      // Write to the output file
      fs.writeFileSync(path.join(buildDir, outputPath), fullHtml);
      console.log(`✅ Page generated: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error generating ${name}.html:`, error);
    }
  }
};

// Execute the static page generation
generateStaticPages().then(() => console.log('✅ All static pages generated successfully!'));
