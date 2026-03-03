const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The issue: "IGUAL TODO EL SISTEMA DEBE SER RESPONSIVO ES DECIR QUE SE ADAPTE A CUALQUIER DISPOSITIVO"
// The screenshot shows a gap on the right side of the screen on mobile, indicating horizontal scrolling is occurring because some element is wider than `100vw`.
// Usually this is caused by a container not having `overflow-hidden` or `max-w-full`, or a `<pre>` / `<lite-youtube>` tag pushing the width.

// 1. Let's ensure the body and main wrappers don't overflow X.
// <body class="min-h-screen"> -> <body class="min-h-screen overflow-x-hidden">
content = content.replace(/<body class="min-h-screen"/g, '<body class="min-h-screen overflow-x-hidden"');

// 2. The <main> content area
// <main class="flex-1 overflow-y-auto"> -> <main class="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
content = content.replace(/<main class="flex-1 overflow-y-auto">/g, '<main class="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">');

// 3. Let's make sure the video container constraints are tight
// <div class="video-container mb-6 relative w-full aspect-video"> -> add max-w-full overflow-hidden
content = content.replace(/class="video-container mb-6 relative w-full aspect-video/g, 'class="video-container max-w-full overflow-hidden mb-6 relative w-full aspect-video');

// 4. Also typography prose bounds
// <div id="video-description" class="prose max-w-none text-premium-textMuted dark:prose-invert">
content = content.replace(/class="([^"]*prose[^"]*max-w-none[^"]*)"/g, 'class="$1 overflow-x-hidden break-words"');

fs.writeFileSync(srcFile, content);
console.log('Applied strict mobile width constraints to prevent horizontal scrolling/zoom-out.');
