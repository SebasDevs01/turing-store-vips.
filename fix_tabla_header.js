const fs = require('fs');
const path = 'tabla_analisis.html';
let c = fs.readFileSync(path, 'utf8');

const headerStart = c.indexOf('<header class="bg-black/50');
const headerEnd = c.indexOf('</header>') + 9;

const newHeader = `<header class="bg-black/50 backdrop-blur-md border-b border-red-900/50 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

      <!-- Logo (clickable) -->
      <div class="flex items-center gap-3 cursor-pointer group flex-shrink-0" onclick="window.location.href='dashboard.html'">
        <img src="assets/image.png" alt="Turing Logo"
            class="logo-img filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)] dark:hidden transition-transform duration-300 group-hover:scale-110"
            onerror="this.style.display='none'">
        <img src="assets/Logoblanco.png" alt="Turing Logo"
            class="logo-img filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)] hidden dark:block transition-transform duration-300 group-hover:scale-110"
            onerror="this.style.display='none'">
        <div>
          <h1 class="text-base font-bold tracking-widest ts-title text-white uppercase group-hover:text-turingRed transition-colors duration-300">Turing Store</h1>
          <p class="text-xs text-turingRed font-semibold uppercase tracking-wider">Tabla de Análisis</p>
        </div>
      </div>

      <!-- Buttons: ← Dashboard + theme + logout — same row, compact -->
      <div class="flex items-center gap-2">
        <button onclick="window.location.href='dashboard.html'"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 hover:border-turingRed text-gray-800 dark:text-white text-xs font-semibold transition-all">
          <i class="fas fa-arrow-left text-turingRed text-xs"></i>
          <span class="hidden sm:inline">Dashboard</span>
        </button>
        <button id="themeToggle"
          class="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 hover:text-turingRed rounded-lg transition-all text-gray-600 dark:text-gray-400">
          <i class="fa-solid fa-moon dark:hidden text-sm"></i>
          <i class="fa-solid fa-sun hidden dark:block text-yellow-500 text-sm"></i>
        </button>
        <button onclick="logout()"
          class="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-[#111] border border-gray-300 dark:border-gray-700 hover:text-turingRed rounded-lg transition-all text-gray-600 dark:text-gray-400"
          title="Cerrar Sesión">
          <i class="fa-solid fa-right-from-bracket text-sm"></i>
        </button>
      </div>

    </div>
  </header>`;

c = c.slice(0, headerStart) + newHeader + c.slice(headerEnd);
fs.writeFileSync(path, c);
console.log('Header compacted OK');
