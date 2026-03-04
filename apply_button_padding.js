const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// Replace the massive p-8 padding on the video-header which houses the "Anterior / Siguiente" buttons
// We want it to be much tighter on mobile (p-4) but remain p-8 on desktop.
const headerPattern = /<div class="video-header text-premium-background p-8 rounded-xl">/g;
content = content.replace(headerPattern, '<div class="video-header text-premium-background p-4 lg:p-8 rounded-xl">');

// Also the user screenshot shows a huge white gap ABOVE the "Anterior / Siguiente" buttons.
// Let's look at the parent container of `video-header` itself.
// The `video-header` is often wrapped inside `<div class="mb-8">`.
// We can reduce this to `mb-4 lg:mb-8` to tighten the layout.
const headerWrapperRegex = /<div class="mb-8">\s*<div class="video-header/g;
content = content.replace(headerWrapperRegex, '<div class="mb-4 lg:mb-8">\n              <div class="video-header');


// Finally, ensure the Anterior Siguiente buttons themselves don't have excessive top margins that push them down.
// They are inside: <div class="hidden lg:flex items-center space-x-3 mt-6 lg:mt-0">
// WAIT. The screenshot SHOWS them on mobile.
// Wait! If they are `hidden lg:flex` they SHOULD NOT BE VISIBLE on mobile! 
// BUT in the screenshot, the buttons are NOT hidden! Let's check the classes.
// Ah, my grep search earlier showed:
// <div class="flex items-center space-x-3 mt-6 lg:mt-0"> <-- maybe they removed "hidden lg:flex"?
// Let's check for any instance of `hidden lg:flex items-center space-x-3 mt-6 lg:mt-0`
const buttonsContainerPattern = /class="hidden lg:flex items-center space-x-3 mt-6 lg:mt-0"/g;
content = content.replace(buttonsContainerPattern, 'class="flex items-center justify-between w-full lg:w-auto space-x-3 mt-4 lg:mt-0"');

fs.writeFileSync(srcFile, content);
console.log("Applied Anterior/Siguiente mobile padding fixes.");
