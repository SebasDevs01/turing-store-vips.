const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The user asked to discard `apply_granular_ux.js`
// So I will REVERT the changes made by that script, properly cleanly this time:

// 1. Revert Sidebar X Button compression (p-5 removed to px-5 px-3 pt-5)
const sidebarRevertRegex = /<div class="px-5 pb-3 pt-5 border-b border-premium-border bg-premium-card flex flex-col gap-2">/g;
content = content.replace(sidebarRevertRegex, '<div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">');

// 2. Revert Main padded wrapper compression
const mainPaddingRevert = /<div class="px-3 py-6 lg:p-10 max-w-6xl mx-auto">/g;
content = content.replace(mainPaddingRevert, '<div class="p-6 lg:p-10 max-w-6xl mx-auto">');

// 3. Revert Video Header mb-0 to mb-4
const headerGapRevert = /<div class="mb-0 lg:mb-8">\s*<div class="video-header text-white px-4 py-2 lg:p-8 rounded-xl">/g;
content = content.replace(headerGapRevert, '<div class="mb-4 lg:mb-8">\n                    <div class="video-header text-white p-4 lg:p-8 rounded-xl">');


// NOW FOR THE REAL FIX. The duplicate buttons.
// The code has:
/*
  <!-- Navegación móvil -->
  <div class="lg:hidden flex justify-between mt-6 bg-premium-card p-4 rounded-xl border border-premium-border">
    <button class="btn-outline flex items-center flex-1 justify-center mr-2" onclick="navigateVideo('prev')">
      <i class="fas fa-arrow-left mr-2"></i> Anterior
    </button>
    <button class="btn-primary flex items-center flex-1 justify-center ml-2" onclick="navigateVideo('next')">
      Siguiente <i class="fas fa-arrow-right ml-2"></i>
    </button>
  </div>
*/

// Since I made the primary buttons (inside `video-header`) responsive using flex wrap in an earlier script, this secondary set is literally a duplicate that is polluting the DOM. Let's delete it universally (27 times).

const duplicateMobileNavPattern = /<!-- Navegación móvil -->[\s\S]*?<div\s*class="lg:hidden flex justify-between mt-6 bg-premium-card p-4 rounded-xl border border-premium-border">[\s\S]*?<button class="btn-outline flex items-center flex-1 justify-center mr-2"[\s\S]*?onclick="navigateVideo\('prev'\)">[\s\S]*?<i class="fas fa-arrow-left mr-2"><\/i> Anterior[\s\S]*?<\/button>[\s\S]*?<button class="btn-primary flex items-center flex-1 justify-center ml-2"[\s\S]*?onclick="navigateVideo\('next'\)">[\s\S]*?Siguiente <i class="fas fa-arrow-right ml-2"><\/i>[\s\S]*?<\/button>[\s\S]*?<\/div>/g;

content = content.replace(duplicateMobileNavPattern, '');

console.log("Stripped explicit duplicate mobile navigation boxes.");

// Since the Previous UX script `mb-4 lg:mb-8` reversion missed on one regex because the padding might have been slightly different in the DOM, let's do a hard replace of `mb-0 lg:mb-8`:
content = content.replace(/mb-0 lg:mb-8/g, 'mb-4 lg:mb-8');
content = content.replace(/px-4 py-2 lg:p-8/g, 'p-4 lg:p-8');


fs.writeFileSync(srcFile, content);
console.log("DOM cleaned and redundantly duplicate navs annihilated.");
