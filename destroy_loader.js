const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// Find the loadingOverlay block and RIP it out.
const loaderRegex = /<!-- Overlay de Carga Principal -->\s*<div id="loadingOverlay"[\s\S]*?<!-- Wrap App -->/g;

if (loaderRegex.test(content)) {
    content = content.replace(loaderRegex, '<!-- Overlay Destruido -->\n  <!-- Wrap App -->');
    console.log("Loading Overlay firmly deleted from HTML DOM.");
} else {
    console.log("Regex failed, trying loose match...");
    const looseLoader = /<div id="loadingOverlay"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Wrap App -->/g;
    if (looseLoader.test(content)) {
        content = content.replace(looseLoader, '<!-- Wrap App -->');
        console.log("Loading Overlay firmly deleted via loose match.");
    } else {
        console.log("Could not find the loadingOverlay block.");
    }
}

// Make absolutely sure appContainer is NOT display: none
content = content.replace(/<div id="appContainer" style="display: none;" class="w-full relative">/g, '<div id="appContainer" class="w-full relative flex lg:flex-row flex-col">');

fs.writeFileSync(srcFile, content);
console.log("All loading impediments destroyed.");
