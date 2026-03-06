const fs = require('fs');
const path = 'tabla_analisis.html';
let c = fs.readFileSync(path, 'utf8');

// The footer is inside main — swap the closing tags
// Current: </footer>\r\n    </main>
// Target:  </main>\n    </footer>  (footer outside main)
c = c.replace('</footer>\r\n    </main>', '</main>\n\n    </footer>');
// Also check unix newline variant
c = c.replace('</footer>\n    </main>', '</main>\n\n    </footer>');

fs.writeFileSync(path, c);
console.log('Done');
