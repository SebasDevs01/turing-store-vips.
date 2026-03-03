const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Fix the Title
content = content.replace(/<title>.*?<\/title>/, '<title>Curso Veo 3.1 - Turing Store</title>');

// 2. Fix the Loading Overlay and completely black screen error
// Currently the body has a class="bg-turingDark text-white min-h-screen" then the loadingOverlayHTML
// First, let's make sure the overlay disappears safely.
const authLogicBroken = /import\('\.\/auth-helper\.js\?v=4'\)\.then\(async \(\{ checkAuth \}\) => \{[\s\S]*?\}\);/;

const safeAuthLogic = `
      // Verificar Autenticación Segura
      import('./auth-helper.js?v=5').then(async ({ checkAuth }) => {
        try {
            const sessionAuth = await checkAuth(true);
            if (!sessionAuth) return; // redirigido
            
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

            // Quitar overlay de carga
            const loader = document.getElementById('loadingOverlay');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }

            // Mostrar página principal
            document.body.style.display = 'block';

            loadProgress();
            if (typeof currentLesson === 'undefined' || currentLesson < 1) showVideo(1);
        } catch (error) {
            console.error(error);
            const loader = document.getElementById('loadingOverlay');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
            loadProgress();
            if (typeof currentLesson === 'undefined' || currentLesson < 1) showVideo(1);
        }
      }).catch(err => {
         console.error("Fetch auth error:", err);
         const loader = document.getElementById('loadingOverlay');
         if (loader) loader.style.display = 'none';
      });
`;
content = content.replace(authLogicBroken, safeAuthLogic);

// Remove the `display: none` from .video-content if there's an overarching container failing
// Actually, earlier in the html extraction process, we might have accidentally inherited a hidden state. Let's ensure body is visible.
// Remove arbitrary background blacks
content = content.replace(/bg-[#000000]/g, 'bg-premium-background');
content = content.replace(/bg-black/g, 'bg-premium-card');

fs.writeFileSync(srcFile, content);
console.log('Fixed overlay bug and title');
