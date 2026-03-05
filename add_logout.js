const fs = require('fs');
let content = fs.readFileSync('curso_veo.html', 'utf8');

// 1. Add the logout function before </body>
const logoutScript = `
  <script>
    function logout() {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userProducts');
      localStorage.removeItem('veo31-progress');
      window.location.href = 'index.html';
    }
  </script>`;

// Insert right before closing </body>
content = content.replace('</body>', logoutScript + '\n</body>');

// 2. Also add a logout button to the mobile header next to the hamburger button
// The mobile header ends with the hamburger button, so we add logout right before the closing </div></div></header>
const hamburgerBtn = `<button id="mobile-menu-toggle"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] border border-premium-border text-premium-textMuted hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950 transition-all">
          <i class="fas fa-bars text-xl"></i>
        </button>`;

const hamburgerWithLogout = `<button id="mobile-menu-toggle"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] border border-premium-border text-premium-textMuted hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950 transition-all">
          <i class="fas fa-bars text-xl"></i>
        </button>`;

// If the logout button isn't in the mobile header, add it
if (!content.includes('mobile-logout-btn')) {
    const logoutMobileBtn = `
        <button id="mobile-logout-btn" onclick="logout()"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] border border-premium-border text-premium-textMuted hover:text-[#E63946] hover:bg-red-50 dark:hover:bg-red-950 transition-all"
          title="Cerrar Sesión">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>`;

    // Insert the logout button right after the hamburger
    content = content.replace(hamburgerWithLogout, hamburgerWithLogout + logoutMobileBtn);
    console.log("Mobile logout button added.");
}

fs.writeFileSync('curso_veo.html', content);
console.log("logout() function injected successfully!");
