const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Add Favicon
// In dashboard.html it is: <link rel="icon" href="assets/image.png" type="image/png">
if (!content.includes('<link rel="icon" href="assets/image.png"')) {
    content = content.replace('</title>', '</title>\n  <link rel="icon" href="assets/image.png" type="image/png">');
}

// 2. Fix Sidebar Height
// The main layout wrapper is: <div class="flex flex-col lg:flex-row min-h-screen">
// The sidebar is: <aside id="sidebar" class="sidebar sidebar-mobile lg:w-80 xl:w-96 h-screen overflow-y-auto fixed lg:relative z-30 flex flex-col">
// If it's `lg:relative` and `h-screen`, it should extend exactly 100vh.
// However, if the main content is LONGER than 100vh, the sidebar will stop at 100vh, leaving an empty void below it if you scroll down!
// To fix this, the sidebar should NOT be `h-screen` when it is relative. Instead, it should be `h-auto` or `min-h-screen` 
// OR better yet, the parent `div.flex.lg:flex-row` should determine the height, and the sidebar should stick to the top:
// class="... lg:sticky lg:top-0 h-screen ..." so it scrolls INSIDE its own container but NEVER leaves a gap.

// Let's modify the aside classes.
const oldAsideRegex = /<aside id="sidebar"[^>]*class="([^"]*)"[^>]*>/;
const asideMatch = content.match(oldAsideRegex);

if (asideMatch) {
    let classes = asideMatch[1];

    // Instead of lg:relative, we make it lg:sticky and lg:top-0, and keep h-screen so it always covers the viewport
    // while the main content scrolls independently.
    classes = classes.replace('lg:relative', 'lg:sticky lg:top-0');

    // Ensure h-screen is present
    if (!classes.includes('h-screen')) {
        classes += ' h-screen';
    }

    content = content.replace(asideMatch[0], `<aside id="sidebar" class="${classes}">`);
    console.log("Updated aside classes to:", classes);
}

fs.writeFileSync(srcFile, content);
console.log('Applied Favicon and Sticky Sidebar fix.');
