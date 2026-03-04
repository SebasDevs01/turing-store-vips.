const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The line we need to replace is exactly this:
const oldLogo = `<img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain filter drop-shadow-md bg-black/10 rounded-full p-1 dark:bg-transparent dark:p-0" onerror="this.src='https://via.placeholder.com/150?text=Logo'">`;

// The exact dual block from index.html / dashboard.html
const newLogos = `
                <img src="assets/image.png" alt="Turing Logo" class="h-10 lg:h-12 w-10 lg:w-12 object-contain filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)] dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
                <img src="assets/Logoblanco.png" alt="Turing Logo" class="hidden h-10 lg:h-12 w-10 lg:w-12 object-contain filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)] dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
`.trim();

// Because there are two instances (Mobile Header and Desktop Sidebar Header)
// We split the content and replace to ensure it gets both, or use regex globally.
// Careful: We must escape the Regex, or simply use `split().join()`

content = content.split(oldLogo).join(newLogos);

fs.writeFileSync(srcFile, content);
console.log('Successfully injected the dual-logo block matching the dashboard specifications.');
