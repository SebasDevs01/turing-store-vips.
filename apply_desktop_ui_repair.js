const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// --- ISSUE 1: Restore the Desktop Sidebar Header Logo ---
// The user noted the "Turing Store" banner and course title are missing from the top of the Desktop sidebar.
// In `curso_veo.html` around line 321, we have:
/*
              <!-- Header del sidebar -->
              <div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">
                <div class="flex items-center justify-between gap-2 mt-2">
*/
// The logo block SHOULD be right inside `p-5 border-b...` above the buttons.
const sidebarHeaderRegex = /<!-- Header del sidebar -->\s*<div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">/;

const fullHeaderHTML = `<!-- Header del sidebar -->
              <div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">
                <div class="hidden lg:flex items-center gap-3">
                  <img src="img/Logoblanco.png" class="h-10 hidden dark:block" alt="Turing UI Dark">
                  <img src="img/image.png" class="h-10 block dark:hidden" alt="Turing UI Light">
                  <div>
                    <h2 class="font-bold text-premium-text text-lg leading-tight tracking-wide">Turing Store</h2>
                    <p class="text-xs text-[#E63946] font-semibold uppercase tracking-wider">Curso Veo 3.1</p>
                  </div>
                </div>`;

if (sidebarHeaderRegex.test(content)) {
    content = content.replace(sidebarHeaderRegex, fullHeaderHTML);
    console.log("Fix 1: Desktop Sidebar Logo & Header restored.");
} else {
    // try looser match
    const looseHeaderRegex = /<!-- Header del sidebar -->[\s\S]*?<div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">/;
    if (looseHeaderRegex.test(content)) {
        content = content.replace(looseHeaderRegex, fullHeaderHTML);
        console.log("Fix 1: Desktop Sidebar Logo & Header restored (loose match).");
    } else {
        console.log("Failed to find Desktop Sidebar insertion point.");
    }
}


// --- ISSUE 2: Viciously Destroy all iframe src attributes ---
// The previous lazy-load script missed 2 iframes, or possibly missed iframes that had spaces before src, or used single quotes.
// Let's replace ANY src tag inside an iframe that has 'drive.google.com'
const angryIframeRegex = /<iframe([^>]*)src=["'](https:\/\/drive\.google\.com\/[^"']+)["']([^>]*)>/g;
let foundIframes = 0;
content = content.replace(angryIframeRegex, (match, p1, p2, p3) => {
    foundIframes++;
    // ensure loading="lazy" is present
    let extras = p3;
    if (!extras.includes('loading="lazy"')) {
        extras = ' loading="lazy"' + extras;
    }
    return `<iframe${p1}data-src="${p2}"${extras}>`;
});

console.log(`Fix 2: Aggressively converted ${foundIframes} iframes from src -> data-src.`);

// --- ISSUE 3: Missing Theme Toggle? ---
// The user says "tampoco veo el boton de modo oscuro y claro".
// Wait, in their desktop screenshot, the Moon icon is right there next to the logout button! 
// Ah, but the Moon button ID in the HTML is `#themeToggle`, which in `admin.html` runs `themeToggle.addEventListener`.
// BUT `curso_veo.html` might not have the JS logic attached to it, or it's named differently.
// Let's check the bottom of the script for `themeToggle`
if (!content.includes("themeToggle.addEventListener")) {
    const themeScript = `
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
    `;

    // Inject at the end of the script tag before closing
    content = content.replace(/<\/script>\s*<\/body>/, `${themeScript}\n  </script>\n</body>`);
    console.log("Fix 3: Injected missing Theme Toggle Javascript logic.");
}

fs.writeFileSync(srcFile, content);
console.log("All explicit Mobile/Desktop fixes applied.");
