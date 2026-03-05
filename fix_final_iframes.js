const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The previous scripts messed up `data-src` into `data-data-src`.
// Let's replace ALL `data-data-src` back to `data-src`.
let dataFixCount = 0;
content = content.replace(/data-data-src=/g, () => {
    dataFixCount++;
    return 'data-src=';
});
console.log(`Fix A: Restored ${dataFixCount} corrupted data-data-src tags.`);


// Let's also ensure NO iframe has `src=` with a drive.google URL.
// Any stray `<iframe src=` or `<iframe \n src=` must be converted.
let unlazyCount = 0;
content = content.replace(/<iframe([^>]*)[\s\n]+src=["'](https:\/\/drive\.google\.com\/[^"']+)["']/g, (match, p1, p2) => {
    unlazyCount++;
    return `<iframe${p1} data-src="${p2}"`;
});
console.log(`Fix B: Converted ${unlazyCount} stubborn src tags to data-src.`);

// Now, let's look at the `showVideo` function to make sure it loads `data-src` properly.
// The current `showVideo` might have a bug or might need to trigger immediately for Video 1 
// if Video 1 is the active video when the page loads, otherwise the user sees a black box.

// Let's modify the end of `curso_veo.html` where `showVideo(1)` is called on page load, 
// to ensure it actually triggers the loading of the first video without forcing the user to click.
// Because if `loading="lazy"`, it won't kill performance if it's the ONLY ONE loading.

const ensureFirstLoad = `
              // Cargar Video 1 por defecto
              if (typeof showVideo === 'function') {
                  showVideo(1);
                  const firstIframe = document.querySelector('#video-1 iframe');
                  if (firstIframe && firstIframe.hasAttribute('data-src') && !firstIframe.getAttribute('src')) {
                      firstIframe.setAttribute('src', firstIframe.getAttribute('data-src'));
                  }
              }
`;
if (content.includes("// Cargar Video 1 por defecto")) {
    content = content.replace(/\/\/ Cargar Video 1 por defecto[\s\S]*?if\s*\(typeof showVideo[\s\S]*?;/, ensureFirstLoad);
    console.log("Fix C: Enforced immediate hot-load of Module 1 video ONCE, preventing black screen.");
}

fs.writeFileSync(srcFile, content);
console.log("All iframe lazy loading repairs completed.");
