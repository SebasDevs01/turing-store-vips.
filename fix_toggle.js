const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The exact string that was injected:
const themeToggleHTML = `
  <button id="theme-toggle" class="p-2 mr-3 rounded-lg text-premium-text bg-premium-card border border-premium-border hover:bg-premium-primary hover:text-white transition-all">
    <i class="fas fa-sun dark:hidden"></i>
    <i class="fas fa-moon hidden dark:inline"></i>
  </button>
`;

// Remove ALL instances of it globally
// We'll just replace the exact text
content = content.split(themeToggleHTML).join('');

// Now, we need to inject it ONLY in the header area, next to the home button.
// The home button looks like this:
// <button onclick="window.location.href='dashboard.html'" class="text-gray-400 hover:text-white transition-colors">
// We can inject it right before the home button.
const target = `<button onclick="window.location.href='dashboard.html'"`;
content = content.replace(target, themeToggleHTML.trim() + '\\n            ' + target);

fs.writeFileSync(srcFile, content);
console.log('Fixed toggle button injection');
