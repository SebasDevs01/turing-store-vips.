const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// Instead of string matching, just use regex to obliterate everything after the last `showVideo(1);`
// in the second script tag!
// The last `if (typeof showVideo === 'function') showVideo(1);`
// is inside the `.catch()` block.

const exactMatch = "if (typeof showVideo === 'function') showVideo(1);\\s*}\\s*}\\);\\s*}\\);\\s*</script>\\s*<script>\\s*function logout\\(\\) \\{[\\s\\S]*?<\\/html>|<\\/div>";

// Let's just find the index of "if (typeof loadProgress === 'function') loadProgress();" where it occurs last!
const anchor = "if (typeof loadProgress === 'function') loadProgress();";
let n = content.lastIndexOf(anchor);

if (n !== -1) {
    const stringHead = content.substring(0, n);

    const pristineFooter = `if (typeof loadProgress === 'function') loadProgress();
            if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                if (typeof showVideo === 'function') showVideo(1);
            }
        });
    });
  </script>

  <script>
      function logout() {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userProducts');
          window.location.href = 'index.html';
      }
  </script>
</div>
<script>
      const htmlElement = document.documentElement;
      
      function updateTheme() {
        if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          htmlElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      }

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      const desktopBtn = document.getElementById('themeToggle');
      const mobileBtn = document.getElementById('theme-toggle-mobile');

      if (desktopBtn) desktopBtn.addEventListener('click', updateTheme);
      if (mobileBtn) mobileBtn.addEventListener('click', updateTheme);
</script>
</body>
</html>`;

    fs.writeFileSync(srcFile, stringHead + pristineFooter);
    console.log("Footer completely rewritten.");
} else {
    console.log("Error: Anchor not found.");
}
