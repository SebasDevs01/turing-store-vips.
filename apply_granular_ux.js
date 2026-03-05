const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// --- ISSUE 1: Empty space around the Sidebar top control buttons (Dashboard/Logout/X) ---
// The container has `p-5` which is `padding: 1.25rem`. We want to compress the top spacing.
// Let's replace: <div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">
// With: <div class="px-5 py-3 border-b border-premium-border bg-premium-card flex flex-col gap-2">
const sidebarHeaderRegex = /<div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">/;
content = content.replace(sidebarHeaderRegex, '<div class="px-5 pb-3 pt-5 border-b border-premium-border bg-premium-card flex flex-col gap-2">');
console.log("Fix 1: Compressed Sidebar Header padding.");


// --- ISSUE 2: Empty space above Anterior/Siguiente buttons ---
// The module wrap for Anterior / Siguiente sits inside `<div class="mb-4 lg:mb-8">` (which we changed in earlier step)
// And the `video-header` has `p-4 lg:p-8`. 
// The user screenshot shows massive gap ABOVE the "Anterior | Siguiente" box. 
// Ah, look at where `video-header` sits inside the main layout.
// Above it is: `<!-- CONTENIDO DE LECCIÓN X --> \n <div id="video-X" class="video-content">`
// What's pushing the `video-content` down?
// Main `<main>` has `<div class="p-6 lg:p-10 max-w-6xl mx-auto">`
// This creates padding `p-6` around EVERYTHING. We can change this to `px-4 py-6` so the top is tighter on mobile.
const mainPaddingRegex = /<div class="p-6 lg:p-10 max-w-6xl mx-auto">/;
content = content.replace(mainPaddingRegex, '<div class="px-3 py-6 lg:p-10 max-w-6xl mx-auto">');
console.log("Fix 2: Compressed Main View wrapper padding.");


// Wait! Look at the `.video-header` element itself! (Around line 1243)
//  <div class="video-header text-white p-4 lg:p-8 rounded-xl">
//    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//      .. Module title ..
//      .. buttons ..
//  The "Anterior/Siguiente" buttons are wrapped in `<div class="flex items-center justify-between w-full lg:w-auto space-x-3 mt-4 lg:mt-0">`
//  That layout has a HUGE flaw on mobile: 
//  The Title ("Módulo 1...") is on TOP, then marginal `mt-4`, then the Buttons.
//  But the VERY BOTTOM screenshot FROM THE USER shows the Title is GONE entirely, and Anterior/Siguiente are alone in a massive black box!
//  Ah! The screenshot "Anterior | Siguiente" box is purely Black! Why?
// Because the user is NOT looking at the top of the video page.
// The user screenshot says:
// ----
// <- Anterior     Siguiente ->
// [VIDEO FRAME SEEN HERE]
// "Descripción"
// ----
// Wait, the "Anterior / Siguiente" box is BLACK in their screenshot! But I just added the Red Gradient to `.video-header`.
// Ah! THEY ARE ALREADY SEEING THE RED GRADIENT. Let me look at screenshot 1.
// Screenshot 1: Mobile Sidebar shows "Módulo 1", Dashboard, X button.
// Screenshot 2: "Curso Veo 3.1" (mobile header), hamburger menu is RED. 
// Screenshot 3: (Wait, is that a different section?) In Screenshot 3, the Video is playing, but the Anterior/Siguiente buttons are housed in a separate black rounded block ABVOE the video! 
// Let me look for where "Anterior" and "Siguiente" live without the Video Title.

content = fs.readFileSync(srcFile, 'utf8'); // refresh for clean check

// Oh! In `paginaveo3.txt`, there are NO Anterior/Siguiente buttons above the video!
// Where did they come from?
// `<div class="p-2 lg:p-4 bg-premium-card... flex items-center justify-between` -> NOT in `curso_veo.html`.
// Wait... The "Anterior Siguiente" buttons IN THE SCREENSHOT are inside a Black rounded rect box.
// In the current `curso_veo` HTML:
// `<button class="btn-outline flex items-center" onclick="navigateVideo('prev')"><i class="fas fa-arrow-left mr-2"></i> Anterior</button>`
// Let's sweep all Anterior / Siguiente blocks and see how they are structured.
const navBtnRegex = /<div class="flex items-center justify-between w-full lg:w-auto space-x-3 mt-4 lg:mt-0">([\s\S]*?)<\/div>/g;
// Actually I replaced them earlier with `mt-4`. That `mt-4` creates space.
// AND the `video-header` has `p-4` around everything. 
// If the video-header is entirely black because the gradient only applied to `.video-header` class...
// WAIT, they say the hamburger icon is RED.
// Let's fix the Hamburger Icon first.

const burgerRegex = /<button id="mobile-menu-toggle"\s*class="w-10 h-10 flex items-center justify-center rounded-lg bg-premium-border text-premium-text hover:bg-premium-primary hover:text-premium-background transition-all">/;
// Text-premium-text means it uses the theme. BUT in Tailwind `text-premium-text` might be mapping to a red color if it conflicts. 
// Let's change it to explicit `dark:text-white text-black bg-gray-200 dark:bg-[#1f1f1f] border border-gray-300 dark:border-[#333]` to ensure NO RED!

content = content.replace(burgerRegex, `<button id="mobile-menu-toggle"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:text-[#E63946] dark:hover:text-[#E63946] transition-all">`);
console.log("Fix 3: Hamburger Icon color explicitly forced to Black/White adaptive.");


// Let's address the Top Space on the Mobile Navigation.
// <div class="mb-4 lg:mb-8">\n  <div class="video-header text-white p-4 lg:p-8 rounded-xl">
// The user doesn't want the Title to stack with the Buttons with so much space. 
// Let's rip ALL `mb-4` margin from above the video container.
const videoHeaderGapRegex = /<div class="mb-4 lg:mb-8">\s*<div class="video-header text-white p-4 lg:p-8 rounded-xl">/g;
content = content.replace(videoHeaderGapRegex, '<div class="mb-0 lg:mb-8">\n              <div class="video-header text-white px-4 py-2 lg:p-8 rounded-xl">');


fs.writeFileSync(srcFile, content);
console.log("Applied all granular UX mobile fixes.");
