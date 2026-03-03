const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The new logo block
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

// Looking at lines 160-174 in the live file:
const obsoleteMobileLogoRegex = /<div class="flex items-center space-x-3">\s*<img decoding="async" src="https:\/\/miembros\.emanuelbolivar\.com[^\"]*"[\s\S]*?alt="Logo EB">\s*<div>\s*<h1[^>]*>.*?<\/h1>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<\/div>/g;
content = content.replace(obsoleteMobileLogoRegex, logoBlock);

// Looking at lines 204-219 in the live file (Sidebar/Desktop logo area):
const obsoleteSidebarLogoRegex = /<div class="flex items-center space-x-3">\s*<img decoding="async" src="https:\/\/miembros\.emanuelbolivar\.com[^\"]*"[\s\S]*?alt="Logo EB">\s*<div>\s*<h2[^>]*>.*?<\/h2>\s*<p[^>]*>.*?<\/p>\s*<\/div>\s*<\/div>/g;
content = content.replace(obsoleteSidebarLogoRegex, logoBlock);

// Adding desktop theme toggle to Desktop Navbar (which is actually in a flex container next to logout)
// In the live file, where is the logout button?
const logoutSearchRegex = /(<button onclick="logout\(\)" class="text-premium-textMuted hover:text-\[#dc2626\] transition-colors">)/;
const desktopThemeToggle = `
  <button id="themeToggle" class="p-2 mr-4 text-premium-textMuted hover:text-[#dc2626] transition hidden lg:block">
      <i class="fa-solid fa-moon dark:hidden text-xl"></i>
      <i class="fa-solid fa-sun hidden dark:block text-xl text-yellow-500"></i>
  </button>
  $1
`;
content = content.replace(logoutSearchRegex, desktopThemeToggle);

fs.writeFileSync(srcFile, content);
console.log('Logos successfully forced over.');
