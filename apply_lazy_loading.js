const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Transform all iframe `src` to `data-src` to prevent the browser from loading 27 Google Drive players at once.
// And add loading="lazy" for extra performance buffer.
const iframeSrcRegex = /<iframe src="(https:\/\/drive\.google\.com\/[^"]+)"/g;
const matchedIframes = content.match(iframeSrcRegex);

if (matchedIframes) {
    console.log(`Found ${matchedIframes.length} iframes to optimize.`);
    content = content.replace(iframeSrcRegex, '<iframe data-src="$1" loading="lazy"');
}

// 2. Inject hot-loading logic into `showVideo(lessonId)`
const showVideoInjectionPoint = `
              const videoContent = document.getElementById(\`video-\${lessonId}\`);

              if (videoContent) {

                videoContent.classList.add('active');

              }`;

const lazyLoadLogic = `
              const videoContent = document.getElementById(\`video-\${lessonId}\`);

              if (videoContent) {

                videoContent.classList.add('active');
                
                // Hotload iframe src if it hasn't been loaded yet for performance
                const iframe = videoContent.querySelector('iframe');
                if (iframe && iframe.hasAttribute('data-src') && !iframe.getAttribute('src')) {
                    iframe.setAttribute('src', iframe.getAttribute('data-src'));
                }

              }`;

if (content.includes(showVideoInjectionPoint)) {
    content = content.replace(showVideoInjectionPoint, lazyLoadLogic);
    console.log("Injected lazy-load JavaScript activation into showVideo().");
} else {
    // try looser matching
    const looseRegex = /const videoContent = document\.getElementById\(`video-\${lessonId}`\);\s*if \(videoContent\) {\s*videoContent\.classList\.add\('active'\);\s*}/;
    if (looseRegex.test(content)) {
        content = content.replace(looseRegex, lazyLoadLogic);
        console.log("Injected lazy-load JavaScript activation into showVideo() [Loose Match].");
    } else {
        console.log("Failed to find showVideo injection point.");
    }
}

fs.writeFileSync(srcFile, content);
console.log("Optimization pass complete.");
