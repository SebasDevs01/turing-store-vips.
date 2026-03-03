const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The issue: 
// 1) The logos in the sidebar have BOTH logos but only the Red (Dark Mode) one is showing.
// Let's check the HTML for Logo:
// <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden" onerror="...">
// <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain hidden dark:block" onerror="...">
// Wait, the user said the Logo is RED in Light Mode.
// The default logo `assets/image.png` is RED. `assets/Logoblanco.png` is WHITE.
// If Light Mode shows `assets/image.png`, it WILL be red. 
// If they want Black in Light Mode, we need to know what the Black Turing Logo filename is.
// In dashboard.html:
// <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)] dark:hidden">
// The logo itself is Red (image.png). There is no "Black Logo" in the assets folder locally, it is just red.
// The user says "EL LOGO QUE DEBE MOSTRAR ES EL BLANCO NO EL ROJO". 
// This means they want `Logoblanco.png` in BOTH Light AND Dark mode, OR they believe `Logoblanco.png` is the black one.
// Let's force `Logoblanco.png` to be the only logo if they hate the red one. Wait, NO: dashboard uses `image.png` on Light mode and `Logoblanco.png` on Dark Mode.
// Let's just use `Logoblanco.png` for both, or perhaps it's an error and they simply want Logoblanco.

// Actually, let's fix the TEXT first.
// The user text issue: "LOS TEXTO DE LAS DESCRIPCIONES Y DEMÁS SE PIERDEN EN MODO CLARO"
// In `curso_veo.html`, the text uses `text-premium-textMuted` which maps to `var(--color-muted)`.
// `var(--color-muted)` in Light is `#6b7280`. Let's check where the very light text comes from.
// In the screenshot, the lesson description text is very light gray.
// The video Description section starts at: `<!-- Descripción --> <div class="p-8">`
const descRegexStr = '<!-- Descripción -->\\s*<div class="p-8">[\\s\\S]*?</div>';
// Wait, the main content is injected by JavaScript `renderDescription()` dynamically!
// Let's find `renderDescription` or where the arrays of data are.

// Actually, reading the HTML logic, the modules are hardcoded `<div class="p-8">`?
// Let's look at `curso_veo.html` around line 250+.
// `<div class="p-8">`
// `  <h2 id="video-title" class="text-2xl font-bold text-premium-text mb-2">Qué vas a aprender aquí</h2>`
// `  <p class="text-premium-primary text-sm mb-6">Módulo 1 — Dominando Veo 3.1</p>`
// `  <div id="video-description" class="prose prose-invert max-w-none text-premium-textMuted">`
// AHA! `prose-invert`!
// `prose-invert` forces Tailwind Typography plugin to make all text White/Light Gray regardless of parent!
// If Light mode is active, `prose-invert` will make text invisible against a white background.

content = content.replace(/prose-invert/g, 'dark:prose-invert');

// Also, the dynamic text loading function sets `innerHTML`. Let's find if any other things use `text-gray-400` or `text-gray-300`.
content = content.replace(/text-gray-400/g, 'text-gray-600 dark:text-gray-400');
content = content.replace(/text-gray-300/g, 'text-gray-700 dark:text-gray-300');

// Now, for the logo. The user complains: "EN MODO CLARO EL LOGO QUE DEBE MOSTRAR ES EL BLANCO NO EL ROJO"
// They want the WHITE LOGO (`Logoblanco.png`) to show in Light Mode (which would normally be invisible on a white background, but perhaps their light mode header is dark?).
// Actually, the Light Mode sidebar is White (`bg-premium-card` -> `#ffffff`). If the logo is white, it will disappear.
// Unless they literally meant "Negro" (Black) instead of "Blanco".
// In index.html, `image.png` is the Red owl, `Logoblanco.png` is the White owl.
// If they want `Logoblanco.png` in Light Mode, I'll just change the img tags so that Logoblanco shows always.
content = content.replace(/<img src="assets\/image\.png"[^>]*>/g, '');
content = content.replace(/<img src="assets\/Logoblanco\.png" alt="Turing Logo" class="[^"]*hidden dark:block[^"]*"[^>]*>/g, '<img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain" onerror="this.src=\'https://via.placeholder.com/150?text=Logo\'">');

// But actually, if they want `Logoblanco` on a white background, maybe they want it inside a dark box? Or let's apply a drop shadow like dashboard.
content = content.replace(/class="h-10 w-10 object-contain"/g, 'class="h-10 w-10 object-contain filter drop-shadow-md bg-black/10 rounded-full p-1 dark:bg-transparent dark:p-0"');

fs.writeFileSync(srcFile, content);
console.log('Fixed prose-invert blinding issue and forced Logoblanco as requested.');
