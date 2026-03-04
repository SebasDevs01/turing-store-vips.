const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Sidebar header layout (Move X button next to Dashboard)
// CURRENT:
// <div class="flex items-center justify-between w-full">
//   <div class="flex-1"></div>
//   <button id="close-sidebar" class="lg:hidden p-2 text-premium-textMuted hover:text-[#E63946] rounded-lg transition-colors">
//     <i class="fas fa-times text-xl"></i>
//   </button>
// </div>
// <div class="flex items-center justify-between gap-2 mt-2">

const oldSidebarHeaderTop = /<div class="flex items-center justify-between w-full">[\s\S]*?<div class="flex-1"><\/div>[\s\S]*?<button id="close-sidebar"[\s\S]*?class="lg:hidden p-2 text-premium-textMuted hover:text-\[#E63946\] rounded-lg transition-colors">[\s\S]*?<i class="fas fa-times text-xl"><\/i>[\s\S]*?<\/button>[\s\S]*?<\/div>\s*<div class="flex items-center justify-between gap-2 mt-2">/;

if (oldSidebarHeaderTop.test(content)) {
    content = content.replace(oldSidebarHeaderTop, `<div class="flex items-center justify-between gap-2 mt-2">`);

    // Now insert the close-sidebar button correctly to the right of logout()
    const logoutBtnEnd = /title="Cerrar Sessión">\s*<i class="fa-solid fa-right-from-bracket"><\/i>\s*<\/button>/;
    if (logoutBtnEnd.test(content)) {
        content = content.replace(logoutBtnEnd, `title="Cerrar Sessión">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>

            <button id="close-sidebar"
              class="lg:hidden w-10 h-10 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#1f1f1f] border border-premium-border text-premium-textMuted hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
              title="Cerrar Menú">
              <i class="fas fa-times text-xl"></i>
            </button>`);
        console.log("Fix 1: Sidebar X button relocated.");
    }
} else {
    console.log("Fix 1 Skipped: Sidebar config already altered or not found.");
}

// 2. Invisible Video Header & Gap Fix
// Add .video-header to style block
if (!content.includes('.video-header {')) {
    content = content.replace('</style>', `
    .video-header {
      background: linear-gradient(135deg, var(--color-primary) 0%, #900B15 100%);
      color: #ffffff;
    }
  </style>`);
    console.log("Fix 2a: Added .video-header Turing background gradient.");
}
// Replace text-premium-background with text-white inside the video-headers
content = content.replace(/<div class="video-header text-premium-background/g, '<div class="video-header text-white');
content = content.replace(/<p class="text-premium-background text-opacity-80/g, '<p class="text-white text-opacity-80');
content = content.replace(/<span\s+class="text-sm font-semibold bg-premium-background bg-opacity-20/g, '<span\n                      class="text-sm font-semibold bg-white bg-opacity-20');
console.log("Fix 2b: Text colors made visible in video-headders.");

// 3. Sidebar Bottom Cutoff Fix
// <nav class="flex-1 overflow-y-auto py-4">
content = content.replace(/<nav class="flex-1 overflow-y-auto py-4">/, '<nav class="flex-1 overflow-y-auto py-4 pb-32">');
console.log("Fix 3: Sidebar bottom padding applied.");

// 4. Hamburger Icon Color
// Change text-premium-primary to text-premium-text
const hamburgerPattern = /<button id="mobile-menu-toggle"\s*class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-border text-premium-primary hover:bg-premium-primary hover:text-premium-background transition-all">/g;
content = content.replace(hamburgerPattern, '<button id="mobile-menu-toggle"\n          class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-border text-premium-text hover:bg-premium-primary hover:text-premium-background transition-all">');
console.log("Fix 4: Hamburger icon contrast fixed.");

fs.writeFileSync(srcFile, content);
