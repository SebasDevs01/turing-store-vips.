const fs = require('fs');
let content = fs.readFileSync('curso_veo.html', 'utf8');

const originalCode = /if\s*\(\s*videoContent\s*\)\s*\{\s*videoContent\.classList\.add\('active'\);\s*\}/gm;

const newCode = `if (videoContent) {
        videoContent.classList.add('active');
        
        // LAZY LOAD: Move data-src to src immediately upon opening
        const iframe = videoContent.querySelector('iframe');
        if (iframe && iframe.hasAttribute('data-src') && !iframe.getAttribute('src')) {
            iframe.setAttribute('src', iframe.getAttribute('data-src'));
        }
      }`;

if (content.match(originalCode)) {
    content = content.replace(originalCode, newCode);

    // Add scroll to top inside showVideo 
    const oldActiveLesson = /setActiveLesson\(lessonId\);/g;
    const newActiveLesson = `setActiveLesson(lessonId);
      
      // Auto scroll to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });`;

    content = content.replace(oldActiveLesson, newActiveLesson);

    fs.writeFileSync('curso_veo.html', content);
    console.log("Lazy Load mechanism and auto-scroll successfully injected into DOM.");
} else {
    console.log("Could not find videoContent block.");
}
