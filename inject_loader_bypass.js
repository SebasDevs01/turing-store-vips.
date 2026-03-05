const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The original loading logic might be handled by auth-helper.js or an inline script,
// but we just need to forcefully disable the loader inside our new cleanJS block.

// We already injected `themeToggle` at the bottom of `curso_veo.html`, right before </body>.
// Let's replace the themeToggle DOMContentLoaded event with one that ALSO hides the loader.

const overrideLoader = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. FORCE THE LOADER TO DIE IMMEDATELY ---
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.style.display = 'none';

        const appContainer = document.getElementById('appContainer');
        if (appContainer) {
            appContainer.style.display = 'flex';
            if (window.innerWidth < 1024) appContainer.style.flexDirection = 'column';
        }

        // Boot Video 1 if it hasn't started
        if (typeof showVideo === 'function') {
            showVideo(1);
        }

        // --- 2. RESTORE THEME TOGGLE EVENTS ---
`;

// Replace the previous `DOMContentLoaded` listener from the theme block
content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/, overrideLoader);

fs.writeFileSync(srcFile, content);
console.log("Forced loading screen destruction logic applied.");
