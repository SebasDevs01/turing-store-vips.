const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The new Logo setup for Turing Store (Light / Dark mode compatibility)
const newLogoHTML = `
      <div class="flex items-center space-x-3 cursor-pointer" onclick="window.location.href='dashboard.html'">
          <img src="assets/image.png" alt="Turing Logo" class="h-12 w-12 object-contain dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
          <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-12 w-12 object-contain hidden dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
          <div>
            <h1 class="font-bold text-gray-900 dark:text-white tracking-widest text-xl group-hover:text-[#dc2626] transition-colors">Turing Store</h1>
            <p class="text-xs text-[#dc2626] font-semibold">Curso Veo 3.1</p>
          </div>
      </div>
`;
// Replace the old left header in sidebar (which I replaced with a fontawesome icon earlier)
content = content.replace(/<div class="flex items-center space-x-3">[\s\S]*?<\/h2>[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/, newLogoHTML);

// Same for the mobile header (it had the old icon too)
const mobileHeaderTarget = /<header class="lg:hidden[\s\S]*?<\/header>/;
const newMobileHeader = `
  <header class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
    ${newLogoHTML}
    <div class="flex items-center gap-4">
      <!-- Dark mode switch mobile -->
      <button id="theme-toggle-mobile" class="text-gray-500 dark:text-gray-400 hover:text-[#dc2626] transition">
          <i class="fa-solid fa-moon dark:hidden text-xl"></i>
          <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
      </button>
      <button id="mobile-menu-toggle" class="p-2 rounded-lg bg-premium-border text-premium-primary hover:bg-premium-primary hover:text-premium-background transition-all">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>
`;
content = content.replace(mobileHeaderTarget, newMobileHeader);

// Fixing the sidebar height
content = content.replace(/<aside id="sidebar"[^>]+>/, '<aside id="sidebar" class="sidebar sidebar-mobile lg:w-80 xl:w-96 min-h-screen sticky top-0 z-30 flex flex-col">');
// Since it's flex flex-col, let's make the nav flex-1:
content = content.replace(/<nav class="flex-1 overflow-y-auto py-4">/, '<nav class="flex-1 overflow-y-auto py-4" style="max-height: calc(100vh - 200px);">');

// The theme toggle button in desktop header
const newThemeToggleHTML = `
  <button id="themeToggle" class="p-2 mr-3 text-gray-500 dark:text-gray-400 hover:text-[#dc2626] transition">
      <i class="fa-solid fa-moon dark:hidden text-2xl"></i>
      <i class="fa-solid fa-sun hidden dark:block text-2xl text-yellow-500"></i>
  </button>
`;
content = content.replace(/<button id="theme-toggle".*?>[\s\S]*?<\/button>/, newThemeToggleHTML);

// Rewrite the JS for the theme toggle to bind both buttons
content = content.replace(/function updateTheme[\s\S]*?if \(themeToggleBtn\)/, `
      function updateTheme() {
        if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          htmlElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      }

      // Evita parpadeos asignando el tema inicial
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      const desktopBtn = document.getElementById('themeToggle');
      const mobileBtn = document.getElementById('theme-toggle-mobile');

      if (desktopBtn) desktopBtn.addEventListener('click', updateTheme);
      if (mobileBtn) mobileBtn.addEventListener('click', updateTheme);

      if (desktopBtn
`);

// The user mentioned dark mode logic in index.html is like this:
// bg-white text-gray-900 dark:bg-turingDark dark:text-white
// Looking at our CSS custom properties that I injected previously:
/*
      --color-primary: #dc2626;
      --color-secondary: #991b1b;
      --color-bg: #f8fafc;
      --color-card: #ffffff;
      --color-border: #e2e8f0;
      --color-text: #0f172a;
      --color-muted: #64748b;

    .dark {
      --color-bg: #050505; // Make it match turingDark
      --color-card: #0f0f0f; // Make it match turingCard
      --color-border: #1f1f1f;
      --color-text: #ffffff;
    }
*/
const modifiedCSSLogic = `
    :root {
      /* Modo Claro (Default) */
      --color-primary: #E63946; /* Rojo Turing Exacto */
      --color-secondary: #b02a35;
      --color-bg: #ffffff;
      --color-card: #f9f9f9;
      --color-border: #e5e7eb;
      --color-text: #111827;
      --color-muted: #6b7280;
      --color-glass: rgba(255, 255, 255, 0.8);
      --shadow-primary: rgba(230, 57, 70, 0.3);
    }
    
    .dark {
      /* Modo Oscuro (Mismo de Index.html) */
      --color-primary: #E63946; 
      --color-secondary: #b02a35;
      --color-bg: #050505; /* turingDark */
      --color-card: #0f0f0f; /* turingCard */
      --color-border: #1f1f1f;
      --color-text: #ffffff;
      --color-muted: #9ca3af;
      --color-glass: rgba(5, 5, 5, 0.8);
      --shadow-primary: rgba(230, 57, 70, 0.4);
    }
`;
content = content.replace(/:root {[\s\S]*?--shadow-primary: rgba\(220, 38, 38, 0\.4\);\s*}/, modifiedCSSLogic);

// Write changes
fs.writeFileSync(srcFile, content);
console.log('Curso veo layout and colors updated for Turing Store');
