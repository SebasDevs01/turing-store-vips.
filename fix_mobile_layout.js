const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Add Mobile Theme Toggle next to the Hamburger menu
// Original Mobile Header closing:
//     <button id="mobile-menu-toggle" class="p-2 rounded-lg bg-premium-border text-premium-primary hover:bg-premium-primary hover:text-premium-background transition-all">
//       <i class="fas fa-bars"></i>
//     </button>
//   </header>

const mobileHeaderButtonsRegex = /(<button id="mobile-menu-toggle"[^>]*>[\s\S]*?<\/button>\s*<\/header>)/;
const mobileButtonsReplacement = `
    <div class="flex items-center gap-2">
        <button id="themeToggleMobile" class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-background border border-premium-border text-premium-textMuted hover:text-[#E63946] transition-all">
            <i class="fa-solid fa-moon dark:hidden"></i>
            <i class="fa-solid fa-sun hidden dark:block text-yellow-500"></i>
        </button>
        <button id="mobile-menu-toggle" class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-border text-premium-primary hover:bg-premium-primary hover:text-premium-background transition-all">
          <i class="fas fa-bars"></i>
        </button>
    </div>
  </header>
`;
content = content.replace(mobileHeaderButtonsRegex, mobileButtonsReplacement);

// We need to make sure `themeToggleMobile` actually has logic assigned.
// Down in the JS we have:
// const desktopBtn = document.getElementById('themeToggle');
// const mobileBtn = document.getElementById('theme-toggle-mobile'); // Wait... earlier it was theme-toggle-mobile
// So I should use the correct ID or update the JS.
content = content.replace('themeToggleMobile', 'theme-toggle-mobile');

// 2. Hide Duplicate Logo in Sidebar on Mobile
// Sidebar Header logo container:
//             <div class="flex items-center space-x-3 cursor-pointer group" onclick="window.location.href='dashboard.html'">
// Let's locate this exactly inside `<aside id="sidebar" ...` by looking for `<!-- Header del sidebar -->` down to `<!-- Progreso del curso -->`.

const sidebarHeaderBlockRegex = /<!-- Header del sidebar -->[\s\S]*?<!-- Progreso del curso -->/;
const sidebarHeaderMatch = content.match(sidebarHeaderBlockRegex);

if (sidebarHeaderMatch) {
    let block = sidebarHeaderMatch[0];
    // Find the logo container
    block = block.replace('<div class="flex items-center space-x-3 cursor-pointer group"', '<div class="hidden lg:flex items-center space-x-3 cursor-pointer group"');

    // Make sure close button aligns right when logo is hidden
    block = block.replace('<button id="close-sidebar" class="lg:hidden p-2 text-premium-textMuted', '<button id="close-sidebar" class="lg:hidden p-2 text-premium-textMuted ml-auto');

    // Replace in main content
    content = content.replace(sidebarHeaderBlockRegex, block);
    console.log("Patched sidebar logic.");
} else {
    console.log("Could not find sidebar block");
}

fs.writeFileSync(srcFile, content);
console.log('Mobile layout patched successfully.');
