const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Fix Tailwind Config
const tailwindPattern = /<script>[\s\S]*?ind\.config = \{[\s\S]*?<\/script>/;
content = content.replace(tailwindPattern, `<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            turingRed: '#E63946',
            turingDarkRed: '#D62828',
            turingDark: '#050505',
            turingCard: '#0f0f0f',
            turingBorder: '#1f1f1f',
            premium: {
              primary: 'var(--color-primary)',
              background: 'var(--color-bg)',
              card: 'var(--color-card)',
              border: 'var(--color-border)',
              text: 'var(--color-text)',
              textMuted: 'var(--color-muted)'
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>`);

// 2. Fix the dangling ); in the main script logic.
// We'll search for the last occurrence of the catch block closure and remove the dangling token.
const danglingError = `        });
);

  </script>`;

if (content.includes(danglingError)) {
    content = content.replace(danglingError, `        });
    });
  </script>`);
} else {
    // If it's already slightly different due to footer fix:
    const altDangling = `        });
    });
  </script>`;
    console.log("No exact dangling Error found. Was it already fixed?");
}

// Ensure the logout script is present at the end
if (!content.includes('function logout()')) {
    const bottomIndex = content.lastIndexOf('</div>');
    if (bottomIndex !== -1) {
        content = content.substring(0, bottomIndex) + `\n  <script>
      function logout() {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userProducts');
          window.location.href = 'index.html';
      }
  </script>\n` + content.substring(bottomIndex);
    }
}

fs.writeFileSync(srcFile, content);
console.log("Forced repair applied.");
