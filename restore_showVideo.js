const fs = require('fs');
let content = fs.readFileSync('curso_veo.html', 'utf8');

const lazyShowVideoLogic = `
    const showVideo = (lessonId) => {
      // Validate range
      if (lessonId < 1) lessonId = 1;
      if (lessonId > totalLessons) lessonId = totalLessons;

      // Hide all content and pause iframes if possible
      videoContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
      });

      // Highlight active sidebar item
      lessonItems.forEach(item => {
        if (parseInt(item.dataset.lesson) === lessonId) {
          item.classList.add('active', 'bg-premium-background', 'border-l-4', 'border-[#E63946]');
          const numSpan = item.querySelector('.lesson-number');
          if (numSpan) {
              numSpan.classList.add('bg-[#E63946]', 'text-white');
              numSpan.classList.remove('bg-premium-border', 'text-premium-textMuted');
          }
        } else {
          item.classList.remove('active', 'bg-premium-background', 'border-l-4', 'border-[#E63946]');
          const numSpan = item.querySelector('.lesson-number');
          if (numSpan) {
              numSpan.classList.remove('bg-[#E63946]', 'text-white');
              numSpan.classList.add('bg-premium-border', 'text-premium-textMuted');
          }
        }
      });

      // Show video
      const targetContent = document.getElementById('video-' + lessonId);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.classList.remove('hidden');

        // LAZY LOAD: Move data-src to src immediately upon opening
        const iframe = targetContent.querySelector('iframe');
        if (iframe && iframe.hasAttribute('data-src') && !iframe.getAttribute('src')) {
            iframe.setAttribute('src', iframe.getAttribute('data-src'));
        }
      }

      currentLesson = lessonId;

      // Close mobile menu if open
      if (window.innerWidth < 1024 && sidebar && sidebar.classList.contains('open')) {
          if (typeof closeMobileMenu === 'function') closeMobileMenu();
      }

      // Smooth scroll back to top of main window
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigateVideo = (direction) => {
      if (direction === 'next' && currentLesson < totalLessons) {
        showVideo(currentLesson + 1);
      } else if (direction === 'prev' && currentLesson > 1) {
        showVideo(currentLesson - 1);
      }
    };
`;

// Insert the functions right before `// Event Listeners`
content = content.replace(/\/\/ Event Listeners/g, lazyShowVideoLogic + '\n\n    // Event Listeners');

fs.writeFileSync('curso_veo.html', content);
console.log("Restored showVideo and navigateVideo mechanics.");
