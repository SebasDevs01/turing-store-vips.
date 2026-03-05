const fs = require('fs');
let content = fs.readFileSync('curso_veo.html', 'utf8');

// 1. Convert hamburger button to use toggle logic AND fix the CSS hover states.
const hamburgerCodeOld = /<button id="mobile-menu-toggle"[\s\S]*?<i class="fas fa-bars"><\/i>\s*<\/button>/;
const hamburgerCodeNew = `<button id="mobile-menu-toggle"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] border border-premium-border text-premium-textMuted hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950 transition-all">
          <i class="fas fa-bars text-xl"></i>
        </button>`;

if (content.match(hamburgerCodeOld)) {
    content = content.replace(hamburgerCodeOld, hamburgerCodeNew);
    console.log("Hamburger button updated to subtle styling matching the theme.");
}

// 2. Remove the "X" button entirely from the sidebar.
const xButtonRegex = /<button id="close-sidebar"[\s\S]*?<i class="fas fa-times text-xl"><\/i>\s*<\/button>/;
if (content.match(xButtonRegex)) {
    content = content.replace(xButtonRegex, '');
    console.log("X close button deleted from the sidebar.");
}

// 3. Update the JavaScript event listeners so mobile-menu-toggle becomes a toggle.
// Replace `mobileMenuToggle.addEventListener('click', openMobileMenu);`
// with a toggle logic arrow function
const listenerOld = /mobileMenuToggle\.addEventListener\('click', openMobileMenu\);/g;
const listenerNew = `mobileMenuToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });`;

if (content.match(listenerOld)) {
    content = content.replace(listenerOld, listenerNew);
    console.log("JavaScript event listener updated to toggle logic.");
}

// 4. Also remove the `closeSidebar.addEventListener('click', closeMobileMenu);` since `closeSidebar` no longer exists.
const listenerCloseOld = /closeSidebar\.addEventListener\('click', closeMobileMenu\);/g;
if (content.match(listenerCloseOld)) {
    content = content.replace(listenerCloseOld, '');
    console.log("Removed dead event listener for closeSidebar.");
}

fs.writeFileSync('curso_veo.html', content);
console.log("Mobile Menu UX updates successfully applied.");
