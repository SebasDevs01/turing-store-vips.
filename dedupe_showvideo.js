const fs = require('fs');

let content = fs.readFileSync('curso_veo.html', 'utf8');

// The `restore_showVideo.js` injected a block exactly preceding `// Event Listeners`.
// Let's use string operations to remove the exact block we injected.

const injectedBlockStart = "const showVideo = (lessonId) => {";
const injectedBlockEnd = "showVideo(currentLesson - 1);\n      }\n    };";

const firstIndex = content.indexOf(injectedBlockStart);
const secondIndex = content.indexOf(injectedBlockStart, firstIndex + 1);

if (secondIndex !== -1) {
    const endIndex = content.indexOf(injectedBlockEnd, secondIndex) + injectedBlockEnd.length;
    // Remove the duplicated block
    content = content.slice(0, secondIndex) + content.slice(endIndex);
    fs.writeFileSync('curso_veo.html', content);
    console.log("Deleted the exact duplicated showVideo/navigateVideo block!");
} else {
    console.log("Duplicate not found.");
}

// Ensure the first video loads eagerly using standard src, matching our previous attempt.
content = fs.readFileSync('curso_veo.html', 'utf8');
const lazyIframeRegex = /<iframe data-src="([^"]+)"[\s\n]*loading="lazy"([^>]*)>/;
const eagerIframe = '<iframe src="$1"$2>';
content = content.replace(lazyIframeRegex, eagerIframe);
fs.writeFileSync('curso_veo.html', content);
console.log("Converted first video to eager load.");
