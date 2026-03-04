const fs = require('fs');
const content = fs.readFileSync('curso_veo.html', 'utf8');
const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
const code = scripts[2].replace(/<script[\s\S]*?>/, '').replace(/<\/script>/, '');
fs.writeFileSync('test_script2.js', code);
console.log('Script 2 exported.');
