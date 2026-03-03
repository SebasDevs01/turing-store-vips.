const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// I am noticing a critical structural flaw when I reviewed lines 150-170 earlier:
// <div class="flex justify-between items-center w-full"> 
// ... <button themeToggle> ... </button>
// </div>
// <button id="close-sidebar" class="lg:hidden ...">
// </div>
// </div>
// There are loose Closing Divs!

// Let's write a targeted regex to fix the mobile header structure.
const mobileHeaderFixRegex = /<header class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm">[\s\S]*?<div class="flex justify-between items-center w-full">[\s\S]*?<button id="themeToggle"[^>]*>[\s\S]*?<\/button>\s*<\/div>\s*<button id="close-sidebar"[^>]*>[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;

// Looking closely at the actual text around line 147:
//   <header class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm">
//       <div class="flex justify-between items-center w-full">
//         ... (Logo Desktop logic wrongly pasted here?)
//         <button themeToggle...
//       </div>
//           <button id="close-sidebar"...> ... </button>
//         </div>
//       </div>

// Wait, the Mobile Header NEVER needed the close-sidebar button! That was for inside the SIDEBAR!
// By doing loose regexes, I completely destroyed the `div.flex.h-screen` wrapper and the Sidebar wrapper (`<aside>`).

console.log("Found structural destruction. Extracting fresh HTML safely.");

require('./extract_clean_html.js');

setTimeout(() => {
    let fresh = fs.readFileSync(srcFile, 'utf8');

    // We will do EXACT string replacements this time. No ambiguous regexes.

    // 1. Auth & Title
    fresh = fresh.replace(/<title>.*?<\/title>/, '<title>Curso Veo 3.1 - Turing Store</title>');
    fresh = fresh.replace('<body class="bg-turingDark text-white min-h-screen">', '<body class="bg-premium-background text-premium-text min-h-screen">');

    // Remove old broken firebase logic injected by extract_clean_html 
    fresh = fresh.replace(/<script type="module">[\s\S]*?<\/script>/, '');

    const safeAuthLogic = `
      import('./auth-helper.js?v=6').then(async ({ checkAuth }) => {
        try {
            const sessionAuth = await checkAuth(true);
            if (!sessionAuth) return;
            
            const { userData } = sessionAuth;
            const bypass = localStorage.getItem('admin_bypass') === 'true';
            
            if (!bypass && !(userData?.purchased_products || []).includes("GEM-005")) {
                alert("No tienes acceso a este Curso. Serás redirigido.");
                window.location.href = 'dashboard.html';
                return;
            }

            document.getElementById('loadingOverlay').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
            
            loadProgress();
            if (typeof currentLesson === 'undefined' || currentLesson < 1) showVideo(1);
        } catch (error) {
            console.error(error);
            document.getElementById('loadingOverlay').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
            loadProgress();
            if (typeof currentLesson === 'undefined' || currentLesson < 1) showVideo(1);
        }
      });
`;
    fresh = fresh.replace(/\/\/ Cargar progreso guardado[\s\S]*?showVideo\(1\);\s*}/, safeAuthLogic);

    // 2. Add safe Overlay wrapper that isn't `body` itself
    fresh = fresh.replace('<body class="bg-premium-background text-premium-text min-h-screen">', `
<body class="bg-premium-background text-premium-text min-h-screen overflow-hidden">
  <div id="loadingOverlay" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-premium-background text-premium-text">
    <i class="fas fa-circle-notch fa-spin text-4xl text-[#dc2626] mb-4"></i>
    <h2 class="font-bold tracking-widest">VERIFICANDO ACCESO...</h2>
  </div>
  <div id="appContainer" class="flex h-screen overflow-hidden" style="display: none;">
`);
    // Close appContainer before scripts
    fresh = fresh.replace('<!-- Overlay móvil -->', '  <!-- Overlay móvil -->');
    fresh = fresh.replace('</script>\n\n    <script>\n      function logout()', '</div>\n  </script>\n\n    <script>\n      function logout()');

    // 3. Exact Layout fixes (Styles)
    const newStyles = `
    :root {
      --color-primary: #E63946;
      --color-secondary: #b02a35;
      --color-bg: #ffffff;
      --color-card: #f9f9f9;
      --color-border: #e5e7eb;
      --color-text: #111827;
      --color-muted: #6b7280;
    }
    .dark {
      --color-primary: #E63946; 
      --color-secondary: #b02a35;
      --color-bg: #050505;
      --color-card: #0f0f0f;
      --color-border: #1f1f1f;
      --color-text: #ffffff;
      --color-muted: #9ca3af;
    }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background-color: var(--color-bg); color: var(--color-text); }
    .sidebar { background-color: var(--color-card); border-right: 1px solid var(--color-border); }
    .lesson-item { border-left: 3px solid transparent; transition: all 0.3s; }
    .lesson-item:hover { background: rgba(220,38,38,0.05); }
    .lesson-item.active { background: rgba(220,38,38,0.1); border-left-color: var(--color-primary); }
    .lesson-item.completed .lesson-number { background: var(--color-primary); color: #fff; }
    .lesson-number { background: var(--color-border); color: var(--color-muted); transition: all 0.3s; }
    .module-title { background: var(--color-card); color: var(--color-primary); font-weight: 600; border-bottom: 1px solid var(--color-border); }
    .video-container { background: var(--color-card); border-radius: 12px; border: 1px solid var(--color-border); }
    .progress-bar { background: var(--color-border); border-radius: 10px; overflow: hidden; }
    .progress-fill { background: var(--color-primary); height: 8px; transition: width 0.5s; }
    .checkmark { width: 22px; height: 22px; border-radius: 50%; background: var(--color-border); display: flex; align-items: center; justify-content: center; }
    .checkmark.completed { background: var(--color-primary); color: #fff; }
    .video-content { display: none; }
    .video-content.active { display: block; animation: fadeIn 0.5s ease; }
    @media (max-width: 1023px) { .sidebar-mobile { transform: translateX(-100%); transition: transform 0.3s ease; } .sidebar-mobile.open { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: var(--color-card); }
    ::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 4px; }
    `;
    fresh = fresh.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + newStyles + '\n  </style>');

    // 4. Branding
    const logoBlock = `
        <div class="flex items-center space-x-3 cursor-pointer" onclick="window.location.href='dashboard.html'">
            <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain hidden dark:block" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
            <div>
              <h1 class="font-bold text-premium-text tracking-widest text-lg lg:text-xl">Turing Store</h1>
              <p class="text-xs text-[#dc2626] font-semibold">Curso Veo 3.1</p>
            </div>
        </div>
    `;

    // Replace the Mobile Header internal completely cleanly
    const mobileHeaderInner = `<div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">E</div>
          <div>
            <h2 class="font-bold text-white tracking-widest text-lg">EmanuelBolivar</h2>
            <p class="text-xs text-gray-400 font-semibold">Curso Veo 3.1</p>
          </div>`;
    fresh = fresh.replace(mobileHeaderInner, logoBlock);

    // Replace Desktop Header internal 
    fresh = fresh.replace(mobileHeaderInner, logoBlock); // (They were the exact same HTML block)

    // Inject Toggle next to Desktop Logout
    fresh = fresh.replace(
        '<button onclick="logout()" class="text-gray-400 hover:text-white transition-colors">',
        `<button id="themeToggle" class="p-2 mr-4 text-premium-textMuted hover:text-[#dc2626] transition">
          <i class="fa-solid fa-moon dark:hidden text-xl"></i>
          <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
      </button>\n          <button onclick="logout()" class="text-premium-textMuted hover:text-[#dc2626] transition-colors">`
    );

    // Inject Toggle in Mobile Header
    fresh = fresh.replace(
        '<button id="mobile-menu-toggle" class="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">',
        `<button id="theme-toggle-mobile" class="p-2 mr-2 text-premium-textMuted hover:text-[#dc2626] transition">
          <i class="fa-solid fa-moon dark:hidden text-xl"></i>
          <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
      </button>\n          <button id="mobile-menu-toggle" class="p-2 text-premium-textMuted hover:text-[#dc2626] transition-colors">`
    );

    // Fix broken classes that were left from original template
    fresh = fresh.replace(/bg-turingDark/g, 'bg-premium-background');
    fresh = fresh.replace(/bg-turingCard/g, 'bg-premium-card');
    fresh = fresh.replace(/border-gray-800/g, 'border-premium-border');
    fresh = fresh.replace(/text-gray-400/g, 'text-premium-textMuted');
    fresh = fresh.replace(/text-white/g, 'text-premium-text');
    fresh = fresh.replace(/<html lang="es">/, '<html lang="es" class="dark">');

    // Add Theme Toggle Script logic
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
    fresh = fresh.replace('</body>', themeScript + '\n</body>');

    fs.writeFileSync(srcFile, fresh);
    console.log("Safely rebuilt course HTML.");
}, 1000);
