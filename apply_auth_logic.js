const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the start of the <script type="module"> which was appended at the end
const scriptModuleRegex = /<script type="module">[\s\S]*?<\/script>/;
content = content.replace(scriptModuleRegex, '');

// Now we need to modify the DOMContentLoaded of the user's script
// We inject the Auth check right before loadProgress();
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

            // Quitar overlay de carga si existiera
            const loader = document.getElementById('loadingOverlay');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }

            // Cargar progreso guardado
            loadProgress();

            // Mostrar la primera lección por defecto si no hay una guardada
            if (!currentLesson || currentLesson < 1) {
              showVideo(1);
            }
        } catch (error) {
            console.error(error);
            loadProgress();
            if (!currentLesson || currentLesson < 1) showVideo(1);
        }
      });
`;

// Replace the inside of DOMContentLoaded
const domLoadedRegex = /\/\/ Cargar progreso guardado[\s\S]*?showVideo\(1\);\s*}/;
content = content.replace(domLoadedRegex, authLogic);

// Add the loading overlay to the body if it doesn't exist
if (!content.includes('loadingOverlay')) {
    const loadingOverlayHTML = `
  <!-- Loading Overlay -->
  <div id="loadingOverlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #0a0f1c; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.5s;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <i class="fas fa-circle-notch fa-spin text-4xl" style="color: #ff6300; margin-bottom: 20px;"></i>
      <h2 style="color: white; font-weight: bold; font-family: sans-serif; letter-spacing: 2px;">VERIFICANDO ACCESO...</h2>
    </div>
  </div>
  `;
    content = content.replace('<body class="min-h-screen">', '<body class="min-h-screen">\n' + loadingOverlayHTML);
}

// Check for contextmenu block and add if missing
if (!content.includes('contextmenu')) {
    content = content.replace('</script>\n\n    <script>\n      function logout()', `
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
}

fs.writeFileSync(filePath, content);
console.log('Done mapping auth logic to the new HTML structure');
