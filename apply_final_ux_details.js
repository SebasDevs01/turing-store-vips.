const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// --- 1. Fix Logos and Image sizes ---
// Replace the old img tags with strict width/height and correct assets path.
const oldLogosRegex = /<img src="img\/Logoblanco\.png" class="h-10 hidden dark:block" alt="Turing UI Dark">\s*<img src="img\/image\.png" class="h-10 block dark:hidden" alt="Turing UI Light">/;

const newLogos = `<img src="assets/Logoblanco.png" class="w-10 h-10 object-contain hidden dark:block" alt="Turing UI Dark">
                  <img src="assets/image.png" class="w-10 h-10 object-contain block dark:hidden" alt="Turing UI Light">`;

if (oldLogosRegex.test(content)) {
    content = content.replace(oldLogosRegex, newLogos);
    console.log("Fix 1: Logos replaced with strict w-10 h-10 constraints and valid assets/ paths.");
} else {
    console.log("Fix 1 Warning: Strict regex failed, attempting loose replacement...");
    content = content.replace(/src="img\/Logoblanco\.png"/g, 'src="assets/Logoblanco.png"');
    content = content.replace(/src="img\/image\.png"/g, 'src="assets/image.png"');
    content = content.replace(/class="h-10 hidden dark:block"/g, 'class="w-10 h-10 object-contain hidden dark:block"');
    content = content.replace(/class="h-10 block dark:hidden"/g, 'class="w-10 h-10 object-contain block dark:hidden"');
}

// --- 2. Fix Theme Toggle Injection ---
// The previous injection `</script>\s*</body>` failed. Let's strictly append before `</body>`
if (!content.includes("themeToggle.addEventListener")) {
    const themeScript = `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('themeToggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }

        const mobileThemeToggleBtn = document.getElementById('theme-toggle-mobile');
        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }
    });
  </script>
</body>`;

    content = content.replace(/<\/body>\s*(<\/html>)?\s*$/i, themeScript + "\n</html>");
    console.log("Fix 2: Injected Theme Toggle DOM block directly above </body>.");
}

fs.writeFileSync(srcFile, content);
console.log("UI patches complete.");
