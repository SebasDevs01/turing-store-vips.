const fs = require('fs');

const repairFile = 'tmp_js_repair.js';
let cleanJS = fs.readFileSync(repairFile, 'utf8');

// The clean JS has the original Firebase auth logic:
// auth.onAuthStateChanged((user) => { ... })
// We need to ensure that the loadingOverlay hides immediately.

const firebaseHack = `
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
    const app = document.getElementById('appContainer');
    if (app) {
      app.style.display = 'flex';
      if (window.innerWidth < 1024) app.style.flexDirection = 'column';
    }
    
    // Auth bypass for Curso Veo
    document.addEventListener('DOMContentLoaded', () => {
        const o = document.getElementById('loadingOverlay');
        if (o) o.style.display = 'none';
        const a = document.getElementById('appContainer');
        if (a) {
            a.style.display = 'flex';
            if (window.innerWidth < 1024) a.style.flexDirection = 'column';
        }
        if (typeof showVideo === 'function') {
            showVideo(1);
        }
    });
`;

// At the very end of the cleanJS script, just above </script>, let's drop our hack + theme logic
const themeJS = `
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('themeToggle');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }

        const mobileThemeToggleBtn = document.getElementById('theme-toggle-mobile');
        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }
    });
`;

cleanJS = cleanJS.replace(/auth\.onAuthStateChanged[\s\S]*?\}\);/g, firebaseHack);
cleanJS = cleanJS.replace(/<\/body>/i, `<script>${themeJS}</script></body>`);

// We also need to rewrite showVideo so that it uses data-src intelligently.
const originalShowVideoPattern = /function showVideo\(lessonNumber\) \{[\s\S]*?\n\s*\}/;
const lazyShowVideo = `
    function showVideo(lessonNumber) {
      // Ocultar todos los videos
      videoContents.forEach(content => {
        content.classList.add('hidden');
      });

      // Mostrar el video seleccionado
      const contentId = 'video-' + lessonNumber;
      const targetDiv = document.getElementById(contentId);
      if (targetDiv) {
         targetDiv.classList.remove('hidden');
         
         // Inyectar el src solo cuando se solicita (Lazy Load efectivo)
         const targetIframe = targetDiv.querySelector('iframe');
         if (targetIframe && targetIframe.hasAttribute('data-src') && !targetIframe.getAttribute('src')) {
             targetIframe.setAttribute('src', targetIframe.getAttribute('data-src'));
         }
      }

      // Actualizar estado de los botones
      lessonItems.forEach(item => {
        const button = item.querySelector('button');
        if (button.getAttribute('data-video') == lessonNumber) {
          button.classList.add('bg-premium-background', 'border-l-4', 'border-[#E63946]');
          button.querySelector('.lesson-number').classList.add('bg-[#E63946]', 'text-white');
          button.querySelector('.lesson-number').classList.remove('bg-premium-border', 'text-premium-textMuted');
        } else {
          button.classList.remove('bg-premium-background', 'border-l-4', 'border-[#E63946]');
          button.querySelector('.lesson-number').classList.remove('bg-[#E63946]', 'text-white');
          button.querySelector('.lesson-number').classList.add('bg-premium-border', 'text-premium-textMuted');
        }
      });

      currentLesson = parseInt(lessonNumber);
      
      // Auto-completar el progreso visual
      toggleCompleted(currentLesson);
    }
`;
cleanJS = cleanJS.replace(originalShowVideoPattern, lazyShowVideo);

// Now read curso_veo.html, cut out everything from <!-- JavaScript --> to the end of the file, and replace it.
let cursoHtml = fs.readFileSync('curso_veo.html', 'utf8');

cursoHtml = cursoHtml.replace(/<!-- JavaScript -->[\s\S]*?<\/html>/gi, '<!-- JavaScript -->\n' + cleanJS);

fs.writeFileSync('curso_veo.html', cursoHtml);
console.log("JavaScript Replacement Completed.");
