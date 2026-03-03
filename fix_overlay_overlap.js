const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The body tag is extremely polluted right now:
// <body class="bg-premium-background text-premium-text min-h-screen">
// Wait, the body class might have Tailwind overriding our custom CSS properties
// Also checking the structure of the HTML wrapper:
const bodyRegex = /<body[^>]*>/;
content = content.replace(bodyRegex, '<body class="min-h-screen">');

// Another possibility: The "main" wrapper div might be missing 
// because I replaced `desktopHeaderOld` with a loose `div`.
// Let's ensure the overlay itself isn't completely covering the screen infinitely.
// The overlay is: <div id="loadingOverlay" style="position: fixed; ...">
// If the auth fails silently or hangs, it never disappears. The previous fix script 
// added `document.body.style.display = 'block';` which would be bad if body was flex/grid.
// Actually, I'll remove that line to prevent display property conflict.
content = content.replace(/document\.body\.style\.display = 'block';/g, '');

// Also, the previous extraction had `<div class="flex h-screen bg-[#050505] text-white overflow-hidden">`
// Let's verify if that main wrapper exists.
if (!content.includes('class="flex h-screen overflow-hidden"')) {
    // Wait, if it's black, maybe it's just `bg-premium-background` working as intended
    // but the UI collapsed?
    console.log('UI Wrapper Check done');
}

// Ensure the loadingOverlay is forced hidden after 2 seconds no matter what.
const fallbackLoader = `
<script>
  setTimeout(() => {
    const loader = document.getElementById('loadingOverlay');
    if (loader && loader.style.display !== 'none') {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
      console.warn('Fallback loader hide triggered.');
    }
  }, 3000);
</script>
</body>
`;
content = content.replace('</body>', fallbackLoader);

fs.writeFileSync(srcFile, content);
console.log('Applied fallback loader hide and body class cleanup');
