const fs = require('fs');
const path = require('path');

// 1. Reset curso_veo.html from paginaveo3.txt (Extracting clean HTML)
require('./extract_clean_html.js');

// Give it a moment (require executes synchronously)
const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 2. Apply Auth Logic
const scriptModuleRegex = /<script type="module">[\s\S]*?<\/script>/;
content = content.replace(scriptModuleRegex, '');

const authLogic = `
      // Verificar Autenticación
      import('./auth-helper.js?v=4').then(async ({ checkAuth }) => {
        try {
            const sessionAuth = await checkAuth(true);
            if (!sessionAuth) return; // Ya fue redirigido
            
            const { userData } = sessionAuth;
            const GEM_ID = "GEM-005";
            const bypass = localStorage.getItem('admin_bypass') === 'true';
            
            if (!bypass) {
                const purchased = userData?.purchased_products || [];
                if (!purchased.includes(GEM_ID)) {
                    alert("No tienes acceso a este Curso. Serás redirigido al Dashboard.");
                    window.location.href = 'dashboard.html';
                    return;
                }
            }

            const loader = document.getElementById('loadingOverlay');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }

            loadProgress();
            if (!currentLesson || currentLesson < 1) showVideo(1);
        } catch (error) {
            console.error(error);
            const loader = document.getElementById('loadingOverlay');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
            loadProgress();
            if (!currentLesson || currentLesson < 1) showVideo(1);
        }
      });
`;
content = content.replace(/\/\/ Cargar progreso guardado[\s\S]*?showVideo\(1\);\s*}/, authLogic);

const loadingOverlayHTML = `
  <!-- Loading Overlay -->
  <div id="loadingOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--color-bg, #000); z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.5s;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <i class="fas fa-circle-notch fa-spin text-4xl" style="color: var(--color-primary, #dc2626); margin-bottom: 20px;"></i>
      <h2 style="color: var(--color-text, #fff); font-weight: bold; font-family: sans-serif; letter-spacing: 2px;">VERIFICANDO ACCESO...</h2>
    </div>
  </div>
`;
content = content.replace('<body class="bg-turingDark text-white min-h-screen">', '<body class="bg-turingDark text-white min-h-screen">\n' + loadingOverlayHTML);

content = content.replace('</script>\\n\\n    <script>\\n      function logout()', `
    // Protecciones
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
            e.preventDefault();
        }
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
        }
    });
  </script>\n\n    <script>\n      function logout()`);

// 3. Turing Store Aesthetics & Layout (Safe replacements)
const newTailwindConfig = `
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            premium: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-secondary)',
              background: 'var(--color-bg)',
              card: 'var(--color-card)',
              border: 'var(--color-border)',
              text: 'var(--color-text)',
              textMuted: 'var(--color-muted)'
            }
          },
          fontFamily: {
            'sans': ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
`;
content = content.replace(/darkMode:\s*'class',[\s\S]*?fontFamily:/, newTailwindConfig.split('fontFamily:')[0] + 'fontFamily:');

const newStyles = `
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

    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--color-bg) !important;
      color: var(--color-text) !important;
      margin: 0; padding: 0; overflow-x: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .sidebar {
      background-color: var(--color-card);
      border-right: 1px solid var(--color-border);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .lesson-item { border-left: 3px solid transparent; background: transparent; transition: all 0.3s ease; }
    .lesson-item:hover { background: rgba(220, 38, 38, 0.05); }
    .lesson-item.active { background: rgba(220, 38, 38, 0.1); border-left-color: var(--color-primary); }
    .lesson-item.completed .lesson-number {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: #ffffff; box-shadow: 0 0 15px var(--shadow-primary);
    }
    .lesson-number { background: var(--color-border); color: var(--color-muted); transition: all 0.3s ease; }
    .module-title { background: var(--color-card); color: var(--color-primary); font-weight: 600; border-bottom: 1px solid var(--color-border); }
    .video-container { background: var(--color-card); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
    .video-header { background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%); color: #ffffff; }
    .progress-bar { background: var(--color-border); border-radius: 10px; overflow: hidden; }
    .progress-fill { background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%); height: 8px; border-radius: 10px; transition: width 0.5s ease; }
    .btn-primary { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); color: #ffffff; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 600; }
    .btn-outline { background: transparent; color: var(--color-primary); border: 1px solid var(--color-primary); border-radius: 8px; padding: 12px 24px; font-weight: 500; }
    .download-card { background: var(--color-card); border-radius: 10px; border: 1px solid var(--color-border); }
    .checkmark { width: 22px; height: 22px; border-radius: 50%; background: var(--color-border); display: flex; align-items: center; justify-content: center; }
    .checkmark.completed { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); color: #ffffff; }
    .video-content { display: none; }
    .video-content.active { display: block; animation: fadeIn 0.5s ease-in; }
    @media (max-width: 1023px) { .sidebar-mobile { transform: translateX(-100%); transition: transform 0.3s ease; } .sidebar-mobile.open { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: var(--color-card); }
    ::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 4px; }
`;
content = content.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + newStyles + '\n  </style>');

// Modify classes safely
content = content.replace(/text-white/g, 'text-premium-text');
content = content.replace(/text-gray-400/g, 'text-premium-textMuted');
content = content.replace(/text-gray-300/g, 'text-premium-textMuted');
content = content.replace(/bg-black bg-opacity-70/g, 'bg-black/70 backdrop-blur-sm');

// Safe Desktop Header Logo Replacement
// Old format was: <div class="flex items-center space-x-3"> ... <h2...> ... <p...> </div>
const desktopHeaderOld = /<div class="flex items-center space-x-3">[\s\S]*?<h2[^>]*>.*?<\/h2>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<\/div>/;
const newDesktopLogoHTML = `
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center space-x-3 cursor-pointer group" onclick="window.location.href='dashboard.html'">
            <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain hidden dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <div>
              <h1 class="font-bold text-premium-text tracking-widest text-xl group-hover:text-premium-primary transition-colors">Turing Store</h1>
              <p class="text-xs text-premium-primary font-semibold">Curso Veo 3.1</p>
            </div>
        </div>
        <button id="themeToggle" class="hidden lg:block p-2 text-premium-textMuted hover:text-premium-primary transition">
            <i class="fa-solid fa-moon dark:hidden text-xl"></i>
            <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
        </button>
      </div>
`;
content = content.replace(desktopHeaderOld, newDesktopLogoHTML);

// Safe Mobile Header Replacements (Just inner contents to preserve header tag)
// Mobile header is: <header class="lg:hidden ..."> ... flex div with hamburger
const mobileHeaderTarget = /<header class="lg:hidden bg-turingCard border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-30">/;
content = content.replace(mobileHeaderTarget, '<header class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm">');

// We re-inject just the logo block without the flex justify-between w-full wrapper for Mobile since it has its own flex container
const mobileHeaderInnerRegex = /<div class="flex items-center space-x-3">\s*<div class="w-10 h-10[^>]*>.*?<\/div>\s*<div>\s*<h2[^>]*>.*?<\/h2>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<\/div>/;
const newMobileLogoHTML = `
        <div class="flex items-center space-x-3 cursor-pointer group" onclick="window.location.href='dashboard.html'">
            <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain hidden dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <div>
              <h1 class="font-bold text-premium-text tracking-widest text-xl group-hover:text-premium-primary transition-colors">Turing Store</h1>
              <p class="text-xs text-premium-primary font-semibold">Curso Veo 3.1</p>
            </div>
        </div>
`;
content = content.replace(mobileHeaderInnerRegex, newMobileLogoHTML);

const mobileMenuRegex = /<button id="mobile-menu-toggle"[^>]*>[\s\S]*?<\/button>/;
const mobileThemeToggle = `
  <div class="flex items-center gap-4">
    <button id="theme-toggle-mobile" class="p-2 text-premium-textMuted hover:text-premium-primary transition">
        <i class="fa-solid fa-moon dark:hidden text-lg"></i>
        <i class="fa-solid fa-sun hidden dark:block text-lg text-yellow-500"></i>
    </button>
    <button id="mobile-menu-toggle" class="p-2 text-premium-primary hover:text-premium-text rounded-lg transition-colors">
      <i class="fas fa-bars text-xl"></i>
    </button>
  </div>
`;
content = content.replace(mobileMenuRegex, mobileThemeToggle);

// Ensure Theme Toggle in Desktop Header (Wait, there was no native desktop header theme toggle! Where should it go? Next to logout button)
// The logout button is `<button onclick="logout()" class="text-gray-400 hover:text-white transition-colors">` in desktop
// which was replaced to `text-premium-textMuted hover:text-premium-text...`
// This block is now removed as the desktop theme toggle is part of newDesktopLogoHTML
// content = content.replace(/<button onclick="logout\(\)" class="text-premium-textMuted hover:text-premium-text transition-colors">/, `
//   <button id="themeToggle" class="p-2 mr-4 text-premium-textMuted hover:text-premium-primary transition">
//       <i class="fa-solid fa-moon dark:hidden text-xl"></i>
//       <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
//   </button>
//   <button onclick="logout()" class="text-premium-textMuted hover:text-premium-primary transition-colors">
// `);


// Fix layout height bounds safely
content = content.replace('<aside id="sidebar" class="sidebar-mobile lg:w-80 xl:w-96 flex-shrink-0 flex flex-col z-40">', '<aside id="sidebar" class="sidebar-mobile lg:w-80 xl:w-96 flex-shrink-0 flex flex-col z-40 min-h-screen">');

// We need to make sure the nav inside has max-height so it scrolls
content = content.replace('<nav class="flex-1 overflow-y-auto py-4">', '<nav class="flex-1 overflow-y-auto py-4" style="max-height: calc(100vh - 150px);">');

// Add Dark Mode Script logic before ending body
const themeScript = `
    <script>
      const htmlElement = document.documentElement;
      
      function updateTheme() {
        if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          htmlElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      }

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
    </script>
`;
content = content.replace('</body>', themeScript + '\n</body>');
content = content.replace('<html lang="es">', '<html lang="es" class="dark">');

// Remove remaining old background colors from main div
content = content.replace(/bg-turingDark/g, 'bg-premium-background');
content = content.replace(/bg-turingCard/g, 'bg-premium-card');
content = content.replace(/text-white/g, 'text-premium-text'); // Run a final sweep just in case 

fs.writeFileSync(srcFile, content);
console.log('Successfully finalized all safe refactoring for curso_veo.html');
