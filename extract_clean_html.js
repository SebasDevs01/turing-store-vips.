const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'archivos txt', 'paginaveo3.txt');
const content = fs.readFileSync(srcFile, 'utf-8');
const lines = content.split('\n');

// Find the start of the embedded HTML block
let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<!DOCTYPE html>') && i > 1200) {
        startIndex = i;
        break;
    }
}

if (startIndex !== -1) {
    // Find the exact matching </html> for this inner block
    for (let i = lines.length - 1; i > startIndex; i--) {
        if (lines[i].includes('</html>')) {
            endIndex = i;
        }
    }
}

// Since the user might have multiple </html> tags, let's just grab the last one
// or just extract from startIndex to the end of the user's custom block.
// We know Elementor closed the widget eventually, so we'll look for `</div>` that don't match or just regex.

// Actually, the easiest way is to know the end of our previous curso_veo HTML:
const extractedHtml = lines.slice(startIndex, endIndex + 1).join('\n');

// BUT we want to replace the standard Google Drive iframes with our new design components or leave them as is.
// Since the layout is already responsive and dark themed (the user kept my structure), we just overwrite curso_veo.html
const destFile = path.join(__dirname, 'curso_veo.html');

// Read the old auth script and ensure it's in the new file
const oldCursoVeo = fs.readFileSync(destFile, 'utf-8');
const oldScriptMatches = oldCursoVeo.match(/<script type="module">[\s\S]*?<\/script>/);

let finalHtml = extractedHtml;
if (oldScriptMatches) {
    // If the user's extracted HTML didn't keep our Firebase Auth script at the bottom, add it back
    if (!finalHtml.includes('import { getAuth')) {
        finalHtml = finalHtml.replace('</body>', '\n' + oldScriptMatches[0] + '\n</body>');
    }
}

// Also add a sweet logout button to the header if missing
if (!finalHtml.includes('Cerrar Sesión') && !finalHtml.includes('Logout')) {
    const headerReplacement = `
          <div class="flex items-center space-x-4">
            <button onclick="window.location.href='dashboard.html'" class="text-gray-400 hover:text-white transition-colors">
              <i class="fas fa-home text-xl"></i>
            </button>
            <div class="h-8 w-8 rounded-full bg-premium-primary flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(255,99,0,0.5)] cursor-pointer" id="user-profile-btn" onclick="logout()">
              <i class="fas fa-user"></i>
            </div>
          </div>
    `;
    finalHtml = finalHtml.replace(/<div class="h-8 w-8 rounded-full bg-premium-primary.*?<\/div>/, headerReplacement);
}

// Ensure the logout function exists
if (!finalHtml.includes('function logout()')) {
    const logoutScript = `
    <script>
      function logout() {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userProducts');
          window.location.href = 'index.html';
      }
    </script>
    `;
    finalHtml = finalHtml.replace('</body>', logoutScript + '\n</body>');
}

fs.writeFileSync(destFile, finalHtml);
console.log('Successfully extracted and wrote to curso_veo.html');
