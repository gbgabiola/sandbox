const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../../');
const items = fs.readdirSync(rootDir);

// Folders to completely ignore during the file system scan
const exclude = ['.git', '.github', 'node_modules', 'img', 'favicons', '.vscode', '.vcode'];

const projects = items
  .filter(item => {
    const fullPath = path.join(rootDir, item);
    return fs.statSync(fullPath).isDirectory() && !exclude.includes(item);
  })
  .map(folder => {
    const jsonPath = path.join(rootDir, folder, 'project.json');
    let displayName = folder;

    // 1. Try to read a localized JSON metadata configuration file first
    if (fs.existsSync(jsonPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (meta.title) displayName = meta.title;
      } catch (e) {
        console.warn(`⚠️ Failed to parse json metadata in folder: ${folder}`);
      }
    } else {
      // 2. Fallback: Automatically format slug names (e.g., "simon-game" -> "Simon Game")
      displayName = folder
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (displayName.toLowerCase() === 'ghibli api') displayName = 'Ghibli API';
    }

    return { folder, displayName };
  });

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
    <link rel="manifest" href="site.webmanifest" />
    <link rel="stylesheet" href="styles.css" />
    <title>Sandbox Projects</title>
  </head>

  <body>
    <div class="container">
      <h1>Sandbox Projects</h1>
      <p>A compilation of my frontend components and responsive layout experiments.</p>

      <ul>
        ${projects.map(project => `<li><a href="${project.folder}" target="_blank">${project.displayName}</a></li>`).join('\n        ')}
      </ul>
    </div>

    <footer>
      <div class="footer-content">
        <div class="footer-meta">
          <p class="footer-brand">&copy; <span id="currentYear"></span> Genesis Gabiola</p>
          <p class="footer-tagline">Crafting modular UI solutions and fluid layout systems.</p>
        </div>
        <div class="footer-links">
          <a href="https://genesisgabiola.tech" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">Source Code</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
        </div>
      </div>
    </footer>

    <script>
      document.getElementById('currentYear').textContent = new Date().getFullYear();
    </script>
  </body>
</html>`;

fs.writeFileSync(path.join(rootDir, 'index.html'), htmlContent);
console.log(`✅ Successfully compiled ${projects.length} sandbox projects!`);
