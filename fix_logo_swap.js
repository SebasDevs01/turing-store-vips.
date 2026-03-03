const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// The correct logo block that completely matches dashboard.html logic
const correctLogoBlock = `
                <img src="assets/image.png" alt="Turing Logo" class="h-10 w-10 object-contain dark:hidden filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
                <img src="assets/Logoblanco.png" alt="Turing Logo" class="hidden h-10 w-10 object-contain dark:block filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]" onerror="this.src='https://via.placeholder.com/150?text=Logo'">
`;

// My previous script replaced BOTH logos with a single Logoblanco.
// Let's find where I injected: 
// <img src="assets/Logoblanco.png" alt="Turing Logo" class="h-10 w-10 object-contain filter drop-shadow-md bg-black/10 rounded-full p-1 dark:bg-transparent dark:p-0" onerror="this.src='https://via.placeholder.com/150?text=Logo'">

const badLogoRegex = /<img src="assets\/Logoblanco\.png"[^>]*class="[^"]*h-10 w-10 object-contain filter drop-shadow-md bg-black\/10 rounded-full p-1 dark:bg-transparent dark:p-0"[^>]*>/g;

content = content.replace(badLogoRegex, correctLogoBlock);

fs.writeFileSync(srcFile, content);
console.log('Restored dynamic Red/White logo toggle');
