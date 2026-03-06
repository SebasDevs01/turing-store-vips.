const fs = require('fs');
const path = 'tabla_analisis.html';
let c = fs.readFileSync(path, 'utf8');

// Find where the reset button ends (last real content inside main)
// Then close main, then put the footer, then the rest

// Find the reset button closing tag
const resetEnd = c.indexOf('</button>\n    </main>');
if (resetEnd > -1) {
    console.log('Found inline main close after reset');
}

// Find the footer start
const fStart = c.indexOf('<footer');
// Find the old footer end + whatever is after it inside/around main
const fEnd = c.indexOf('</footer>') + 9;

// Extract the footer HTML
const footerHTML = c.slice(fStart, fEnd);
console.log('Footer HTML:\n', footerHTML.slice(0, 100));

// Find the reset button </button> (the last button before footer)
const resetBtnEnd = c.lastIndexOf('</button>', fStart);
console.log('Reset button ends at:', resetBtnEnd);

// Rebuild: everything up to and including reset button, then </main>, then footer, then script+body close
const beforeFooter = c.slice(0, resetBtnEnd + 9); // up to and including </button>
const afterFooter = c.slice(fEnd); // everything after </footer>

// Clean up afterFooter: remove stray </main> or </footer> leftovers
let cleaned = afterFooter.replace(/\s*<\/main>\s*\n/, '\n').replace(/\s*<\/footer>\s*\n/, '\n');

const newContent = beforeFooter +
    '\n\n    </main>\n\n    ' +
    footerHTML.trim() +
    '\n\n' + cleaned;

fs.writeFileSync(path, newContent);
console.log('Done. Verifying...');

const v = fs.readFileSync(path, 'utf8');
const mainClose = v.indexOf('</main>');
const footerOpen = v.indexOf('<footer');
const footerClose = v.indexOf('</footer>');
console.log('</main> at:', mainClose);
console.log('<footer> at:', footerOpen);
console.log('</footer> at:', footerClose);
console.log('ORDER CORRECT (</main> before <footer>):', mainClose < footerOpen);
