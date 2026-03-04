const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The pristine core script
let coreScript = fs.readFileSync('extracted_core_script.html', 'utf8');

// Build the bulletproof auth logic
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

coreScript = coreScript.replace(
    /(\/\/ Cargar progreso guardado)[\s\S]*?(if \(!currentLesson[\s\S]*?\}\s*})/,
    pristineAuthLogic
);

// To ensure we get rid of the dangling `);` syntax error we created earlier, we will 
// also just use the content we built.

// Use Regex to replace the ENTIRE script block that contains 'mobile-menu-toggle'
const targetRegex = /<script>[\s\S]*?mobileMenuToggle = document\.getElem[\s\S]*?<\/script>/;
if (targetRegex.test(content)) {
    content = content.replace(targetRegex, coreScript);
    console.log("Replaced Script 2 using Regex successfully!");
} else {
    console.log("Could not find the mangled script block via Regex.");
}

fs.writeFileSync(srcFile, content);
