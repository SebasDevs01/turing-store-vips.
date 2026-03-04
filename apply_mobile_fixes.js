const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. DUPLICATE LOGO FIX (Sidebar Mobile)
// We only want to remove the logo from the SIDEBAR header, not the top sticky mobile header.
// The sidebar header is enclosed within:
// <div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">
//   <div class="flex items-center justify-between w-full">
//     <div class="flex items-center space-x-3 cursor-pointer group"...
// ... </div>
const logoInSidebarRegex = /(<div class="p-5 border-b border-premium-border bg-premium-card flex flex-col gap-4">[\s\S]*?<div class="flex items-center justify-between w-full">)[\s\S]*?(<button id="close-sidebar")/;

if (logoInSidebarRegex.test(content)) {
    content = content.replace(logoInSidebarRegex, '$1\n            <div class="flex-1"></div>\n            $2');
    console.log("Removed duplicate Sidebar logo.");
} else {
    console.log("Could not find Sidebar logo block.");
}


// 2. EXCESS HEIGHT ON BUTTONS FIX
// The "Anterior / Siguiente" block is inside the video-header:
// <div class="video-header text-premium-background p-8 rounded-xl">
// The p-8 class creates 2rem of padding uniformly. We'll change it to be smaller on mobile.
// Also, looking at the screenshot, the white space above the video in dark mode / mobile is huge.
const headerPattern = /class="video-header text-premium-background p-8 rounded-xl"/g;
content = content.replace(headerPattern, 'class="video-header text-premium-background p-4 lg:p-8 rounded-xl"');

// And to make the Anterior/Siguiente buttons more visible on mobile, they were hidden behind a lg:flex block.
// Wait! The user screenshot shows "Anterior  Siguiente" directly above the Video!
// Let's look for `<div class="p-2 lg:p-4 bg-premium-card... flex items-center justify-between` or similar in my earlier file sweep...

// Since Anterior/Siguiente were wrapped in `hidden lg:flex` in my first look at line 2124!
// Actually line 2124 is the desktop buttons.
// Let's replace the mobile padding on the actual video container wrapper just in case.

const videoContainerPattern = /<div class="video-container fade-in mb-8">/g;
content = content.replace(videoContainerPattern, '<div class="video-container fade-in mb-8 mt-4 lg:mt-0">');


fs.writeFileSync(srcFile, content);
console.log("Applied padding and duplicate logo fixes.");
