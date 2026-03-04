const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The pristine core script
let coreScript = fs.readFileSync('extracted_core_script.html', 'utf8');

const pristineAuthLogic = `
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

// To inject by exact index, we find all scripts
const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
let match;
let matches = [];
while ((match = scriptRegex.exec(content)) !== null) {
    matches.push({
        full: match[0],
        start: match.index,
        end: match.index + match[0].length
    });
}

if (matches.length > 2) {
    const targetScript = matches[2]; // Script 2
    content = content.substring(0, targetScript.start) + coreScript + content.substring(targetScript.end);

    // Also strip out any remaining syntax artifacts from bottom using split-join
    content = content.split("        });\\r\\n\\);").join("        });");
    content = content.split("        });\\n\\);").join("        });");
    content = content.split("        });\\r\\n);").join("        });");
    content = content.split("        });\\n);").join("        });");

    fs.writeFileSync(srcFile, content);
    console.log("Surgical array splice completed.");
} else {
    console.log("Could not find enough scripts.");
}
