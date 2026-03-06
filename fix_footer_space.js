const fs = require('fs');
let c = fs.readFileSync('tabla_analisis.html', 'utf8');
// Add min-h-screen to body
c = c.replace('class="antialiased flex flex-col"', 'class="antialiased flex flex-col min-h-screen"');
fs.writeFileSync('tabla_analisis.html', c);
console.log('OK');
