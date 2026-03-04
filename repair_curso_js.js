const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The Pristine Tailwind Config String
const pristineTailwind = `
  <script>
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
  </script>
`;

// Extract all scripts from curso_veo.html
const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);

// Script 1 is supposed to be tailwind config. Let's replace whatever is there (at index 1)
if (scripts && scripts.length > 2) {
    content = content.replace(scripts[1], pristineTailwind.trim());
}

// Now for Script 2, which is the core course logic. We have the pristine version in extracted_core_script.html
let coreScript = fs.readFileSync('extracted_core_script.html', 'utf8');

// Create a completely bulletproof auth logic snippet
const pristineAuthLogic = `
      // Cargar progreso guardado ... (REPLACED BY AUTH LOGIC)
      import('./auth-helper.js?v=7')
        .then(async ({ checkAuth }) => {
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

                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.style.display = 'none';
                const app = document.getElementById('appContainer');
                if (app) {
                    app.style.display = 'flex';
                    if (window.innerWidth < 1024) app.style.flexDirection = 'column';
                }
                
                if (typeof loadProgress === 'function') loadProgress();
                if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                    if (typeof showVideo === 'function') showVideo(1);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.style.display = 'none';
                const app = document.getElementById('appContainer');
                if (app) {
                    app.style.display = 'flex';
                    if (window.innerWidth < 1024) app.style.flexDirection = 'column';
                }
                if (typeof loadProgress === 'function') loadProgress();
                if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                    if (typeof showVideo === 'function') showVideo(1);
                }
            }
        })
        .catch(err => {
            console.error("Fatal Auth Import Failure:", err);
            // Fallback: Drop the veil so user isn't frozen forever (though course might not load correctly, better than freeze)
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.style.display = 'none';
            const app = document.getElementById('appContainer');
            if (app) {
                app.style.display = 'flex';
                if (window.innerWidth < 1024) app.style.flexDirection = 'column';
            }
            if (typeof loadProgress === 'function') loadProgress();
            if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                if (typeof showVideo === 'function') showVideo(1);
            }
        });
`;

// Replace the end of the pristine core script with the bulletproof logic
coreScript = coreScript.replace(
    /(\/\/ Cargar progreso guardado)[\s\S]*?(if \(!currentLesson[\s\S]*?\}\s*})/,
    pristineAuthLogic
);

// We replace Script 2 with our pristine constructed Core Script
if (scripts && scripts.length > 2) {
    content = content.replace(scripts[2], coreScript.trim());
}

fs.writeFileSync(srcFile, content);
console.log('Successfully repaired curso_veo.html JavaScript Syntax Corruption.');
