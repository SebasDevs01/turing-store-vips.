const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The screenshot shows TWO sets of Anterior / Siguiente buttons.
// Set 1: Inside the Red Gradient block (which is .video-header).
// Set 2: Inside a separate White block below it.

// Let's sweep the HTML to find this separate white block.
// Earlier, I noticed `<div class="p-2 lg:p-4 bg-premium-card border... flex items-center justify-between` in the user's older screenshot context.
// Let's use Regex to find and annihilate ANY secondary button row that matches:
// `<div class="... flex items-center justify-between ..."> \n <button class="btn-outline... Anterior ... <button class="btn-primary ... Siguiente`

// Let's actually find the specific block I'm looking for by checking the HTML nearby.

// In `paginaveo3.txt`, the buttons are INSIDE `.video-header`. There was NO secondary block.
// The secondary block was likely added artificially by my previous scripts or existed from a flawed regex copy previously.

// Wait, the user said: "descarta el cambio ultimo que hiciste a un archivo y quiero que elimines el boton de anterior y siguiente ya que en el primer modulo en el que vas a aprender sale doble"
// Ah! In `apply_granular_ux.js`, I did THIS:
// const videoHeaderGapRegex = /<div class="mb-4 lg:mb-8">\s*<div class="video-header text-white p-4 lg:p-8 rounded-xl">/g;
// content = content.replace(videoHeaderGapRegex, '<div class="mb-0 lg:mb-8">\n              <div class="video-header text-white px-4 py-2 lg:p-8 rounded-xl">');
// That change wasn't what caused the double buttons, the double buttons were ALWAYS there! But they were black on black, so invisible. Until I forced the background color.

// Let's look for the SECOND block of Anterior / Siguiente in the HTML.
console.log("Looking for stray navigation buttons...");

const navRegex = /<div class="flex items-center justify-between[\s\S]*?<button class="btn-outline[\s\S]*?Anterior[\s\S]*?Siguiente[\s\S]*?<\/button>\s*<\/div>/g;
// Actually, I can just look at `curso_veo.html` manually.
