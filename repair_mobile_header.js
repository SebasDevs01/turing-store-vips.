const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The multi_replace_file_content tool mangled the header.
// I will find the start of the `<header class="lg:hidden ` and the start of `<div id="mobile-overlay"`
// And completely rewrite the mobile header cleanly.

const headerStart = '<header\n      class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm">';

const cleanHeaderHTML = `<header class="lg:hidden bg-premium-card border-b border-premium-border p-4 flex justify-between items-center sticky top-0 z-30 backdrop-blur-sm">

      <div class="flex items-center space-x-3 cursor-pointer group" onclick="window.location.href='dashboard.html'">
        <img src="assets/image.png" alt="Turing Logo"
          class="h-10 lg:h-12 w-10 lg:w-12 object-contain dark:hidden transition-transform duration-300 group-hover:scale-110"
          onerror="this.src='https://via.placeholder.com/150?text=Logo'">
        <img src="assets/Logoblanco.png" alt="Turing Logo"
          class="hidden h-10 lg:h-12 w-10 lg:w-12 object-contain dark:block transition-transform duration-300 group-hover:scale-110"
          onerror="this.src='https://via.placeholder.com/150?text=Logo'">
        <div>
          <h1
            class="font-bold text-premium-text tracking-widest text-lg lg:text-xl group-hover:text-turingRed transition-colors duration-300">
            Turing Store</h1>
          <p class="text-xs text-[#dc2626] font-semibold">Curso Veo 3.1</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button id="theme-toggle-mobile"
          class="w-10 h-10 flex items-center justify-center text-premium-textMuted hover:text-[#E63946] bg-premium-background border border-premium-border rounded-lg transition-all">
          <i class="fa-solid fa-moon dark:hidden"></i>
          <i class="fa-solid fa-sun hidden dark:block text-yellow-500"></i>
        </button>

        <button id="mobile-menu-toggle"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-border text-premium-primary hover:bg-premium-primary hover:text-premium-background transition-all">
          <i class="fas fa-bars"></i>
        </button>
      </div>

    </header>

    <!-- Overlay móvil -->
    <div id="mobile-overlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-20 hidden"></div>`;

// Regex from appContainer to mobile-overlay to clear whatever is there:
const regex = /<!-- Header móvil -->[\s\S]*?<div id="mobile-overlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-20 hidden"><\/div>/;

if (regex.test(content)) {
    content = content.replace(regex, `<!-- Header móvil -->\n\n    ${cleanHeaderHTML}`);
    console.log("Header DOM restored flawlessly.");
} else {
    // try a broader sweep
    const backupRegex = /<header\s+class="lg:hidden[\s\S]*?<div id="mobile-overlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-20 hidden"><\/div>/;
    if (backupRegex.test(content)) {
        content = content.replace(backupRegex, cleanHeaderHTML);
        console.log("Header DOM restored via backup regex.");
    } else {
        console.log("Could not locate the mangled header. Please check file.");
    }
}

fs.writeFileSync(srcFile, content);
