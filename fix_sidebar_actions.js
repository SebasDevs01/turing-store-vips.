const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The main issue with colors in dark mode is that Tailwind doesn't generate the `--color-text` binding correctly if config is slightly off,
// OR the element doesn't have the `text-premium-text` class explicitly.
// Let's force Tailwind config to exactly match Dashboard.html, removing the 'premium' prefix abstraction entirely to match Turing Store standard.
// Dashboard uses hardcoded tailwind classes where applicable, but we will redefine the CSS properties robustly.

const tailwindConfig = `
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            turingRed: '#E63946',
            turingDarkRed: '#D62828',
            turingDark: '#050505',
            turingCard: '#0f0f0f',
            turingBorder: '#1f1f1f',
            premium: {
              primary: 'var(--color-primary)',
              background: 'var(--color-bg)',
              card: 'var(--color-card)',
              border: 'var(--color-border)',
              text: 'var(--color-text)',
              textMuted: 'var(--color-muted)'
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
`;
content = content.replace(/tailwind\.config = \{[\s\S]*?\}\s*\}/, tailwindConfig);

// Rewrite the CSS to guarantee colors apply correctly
const newCSSParams = `
    :root {
      --color-primary: #E63946;
      --color-bg: #f9fafb;
      --color-card: #ffffff;
      --color-border: #e5e7eb;
      --color-text: #111827;
      --color-muted: #6b7280;
    }
    .dark {
      --color-primary: #E63946; 
      --color-bg: #050505;
      --color-card: #0f0f0f;
      --color-border: #1f1f1f;
      --color-text: #ffffff;
      --color-muted: #9ca3af;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background-color: var(--color-bg) !important; color: var(--color-text) !important; }
    .sidebar { background-color: var(--color-card) !important; border-right: 1px solid var(--color-border) !important; }
    .lesson-item { border-left: 3px solid transparent; transition: all 0.3s; }
    .lesson-item:hover { background: rgba(230,57,70,0.05); }
    .lesson-item.active { background: rgba(230,57,70,0.1); border-left-color: var(--color-primary); }
    .lesson-item.completed .lesson-number { background: var(--color-primary); color: #fff; }
    .lesson-number { background: var(--color-border); color: var(--color-muted); transition: all 0.3s; }
    .module-title { background: var(--color-card) !important; color: var(--color-primary) !important; font-weight: 600; border-bottom: 1px solid var(--color-border) !important; }
    .video-container { background: var(--color-card) !important; border-radius: 12px; border: 1px solid var(--color-border) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; }
    .progress-bar { background: var(--color-border) !important; border-radius: 10px; overflow: hidden; }
    .progress-fill { background: var(--color-primary) !important; height: 8px; transition: width 0.5s; box-shadow: 0 0 10px rgba(230,57,70,0.5); }
    .checkmark { width: 22px; height: 22px; border-radius: 50%; background: var(--color-border) !important; display: flex; align-items: center; justify-content: center; }
    .checkmark.completed { background: var(--color-primary) !important; color: #fff; box-shadow: 0 0 10px rgba(230,57,70,0.5); }
    .video-content { display: none; }
    .video-content.active { display: block; animation: fadeIn 0.5s ease; }
    @media (max-width: 1023px) { .sidebar-mobile { transform: translateX(-100%); transition: transform 0.3s ease; } .sidebar-mobile.open { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: var(--color-card) !important; }
    ::-webkit-scrollbar-thumb { background: var(--color-primary) !important; border-radius: 4px; }
    
    /* Global Color Fixes specifically for Tailwind Text */
    .text-premium-text { color: var(--color-text) !important; }
    .text-premium-textMuted { color: var(--color-muted) !important; }
    .text-premium-primary { color: var(--color-primary) !important; }
    .bg-premium-background { background-color: var(--color-bg) !important; }
    .bg-premium-card { background-color: var(--color-card) !important; }
    h1, h2, h3, h4, p, span { color: inherit; }
`;
// Extract current styles and replace with new
content = content.replace(/:root \{[\s\S]*?::-webkit-scrollbar-thumb \{[^}]*\}\s*/, newCSSParams);

// Since the user is complaining about the back to dashboard button and theme toggle, 
// they need to be in the DESKTOP Sidebar Header as well as the mobile header.

const desktopSidebarHeaderRegex = /<aside id="sidebar"[^>]*>[\s\S]*?<!-- Header del sidebar -->[\s\S]*?<div class="flex items-center space-x-3 cursor-pointer" onclick="window\.location\.href='dashboard\.html'">[\s\S]*?<\/div>[\s\S]*?<\/div>\s*<\/div>/;

// Build the perfect Turing Store sidebar header containing Logo, Theme Toggle, and Dashboard Button.
const newSidebarHeader = `
    <aside id="sidebar" class="sidebar sidebar-mobile lg:w-80 xl:w-96 h-screen overflow-y-auto fixed lg:relative z-30 flex flex-col">
      <!-- Header del sidebar -->
      <div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-3 cursor-pointer group" onclick="window.location.href='dashboard.html'">
                <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
                <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain hidden dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
                <div>
                  <h1 class="font-bold text-premium-text tracking-widest text-lg lg:text-xl">Turing Store</h1>
                  <p class="text-xs text-[#E63946] font-semibold">Curso Veo 3.1</p>
                </div>
            </div>
            
            <button id="close-sidebar" class="lg:hidden p-2 text-premium-textMuted hover:text-[#E63946] rounded-lg transition-colors">
              <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        
        <div class="flex items-center justify-between gap-2 mt-2">
            <button onclick="window.location.href='dashboard.html'" class="flex-1 bg-premium-background border border-premium-border hover:border-[#E63946] text-premium-text text-sm font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2">
                <i class="fas fa-arrow-left text-[#E63946]"></i> Dashboard
            </button>
            
            <button id="themeToggle" class="hidden lg:flex w-10 h-10 items-center justify-center text-premium-textMuted hover:text-[#E63946] bg-premium-background border border-premium-border rounded-lg transition-all">
                <i class="fa-solid fa-moon dark:hidden"></i>
                <i class="fa-solid fa-sun hidden dark:block text-yellow-500"></i>
            </button>

            <button onclick="logout()" class="w-10 h-10 flex flex-col items-center justify-center bg-premium-background border border-premium-border text-premium-textMuted hover:text-[#E63946] rounded-lg transition-all" title="Cerrar Sessión">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        </div>
      </div>
`;
content = content.replace(/<aside id="sidebar"[\s\S]*?<!-- Header del sidebar -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newSidebarHeader);

fs.writeFileSync(srcFile, content);
console.log('Fixed CSS Override bugs and added dashboard/theme action bars to sidebar');
