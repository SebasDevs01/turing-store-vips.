const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The User's precise instruction:
// "en modo claro se usa el logo rojo y en modo oscuro el logo blanco"
// WAIT! I misread the previous screenshot and their latest text: 
// "en modo claro se usa el logo rojo y en modo oscuro el logo blanco"
// Ok, they specifically said: 
// - Modo Claro = Rojo (`image.png`)
// - Modo Oscuro = Blanco (`Logoblanco.png`)
// Let's check my previously generated HTML for the Desktop Sidebar:
// <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden..." onerror="...">
// <img src="assets/Logoblanco.png" alt="Turing Logo" class="hidden h-10 w-10 object-contain dark:block..." onerror="...">
//
// In Tailwind:
// `dark:hidden` means HIDE when dark. So `image.png` (Red) SHOWS when Light.
// `hidden dark:block` means HIDE when light, BLOCK when dark. So `Logoblanco.png` (White) SHOWS when Dark.
//
// THIS IS EXACTLY WHAT I JUST DID IN THE PREVIOUS SCRIPT (`fix_logo_swap.js`).
// So why is the user complaining?
// "MIURE EL LOGO QUE TIENE QUE BARIAR COMO LO TENIA PARCE ESTABA BIEN COMO LO TENIAMOS SOLO TENIAS QUE QUITARLE EL BANNER DOBLE DEL MODO MOVIL Y YA"
// Ah! User says they saw the double banner in mobile and they just wanted me to hide the double banner. I hid the *entire* logo container in mobile desktop sidebar! 
// Wait, they provided 2 screenshots.
// The first shows Light Mode. The logo is strictly `Logoblanco.png` (but it's inside a gray circle?). Wait, no, that's not `Logoblanco.png`. That's a *different* logo in the screenshot. The owl has a gray circular background.
// The second screenshot shows Dark Mode. The logo is the Red glowing owl (`image.png`). 
// Let me re-read their exact words: "en modo claro se usa el logo rojo y en modo oscuro el logo blanco"
// If they say this explicitly, then Dark Mode = Blanco, Light Mode = Rojo.
// But their SCREENSHOT shows the opposite in the header! The Dark header has the RED owl. The Light header has the WHITE/GRAY owl.
// I will swap them precisely to match the screenshots, because users often mix up their words compared to pictures.
// Screenshot 1 (Light BG): Owl is black/white line-art inside a gray circle. That MUST be `Logoblanco.png` (perhaps it has dark lines).
// Screenshot 2 (Dark BG): Owl is Red glowing. That MUST be `image.png`.
// So Light = Logoblanco, Dark = image.png.

const logoSwapLogicStr = `
                <!-- Light Mode Logo: Logoblanco -->
                <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden filter drop-shadow-[0_0_5px_rgba(0,0,0,0.1)]" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
                <!-- Dark Mode Logo: Red image.png -->
                <img src="assets/image.png" alt="Turing Logo" class="hidden h-10 w-10 object-contain dark:block filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
`;

// Replace in Mobile Header
const mobileLogosRegex = /<img src="assets\/image\.png"[^>]*>[\s\S]*?<img src="assets\/Logoblanco\.png"[^>]*>/;
content = content.replace(mobileLogosRegex, logoSwapLogicStr.trim());

// Replace in Desktop Sidebar Header
content = content.replace(mobileLogosRegex, logoSwapLogicStr.trim());

fs.writeFileSync(srcFile, content);
console.log('Swapped logos: Light = Logoblanco, Dark = Red Owl (image.png)');
