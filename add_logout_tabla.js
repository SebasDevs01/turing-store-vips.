const fs = require('fs');
const path = 'tabla_analisis.html';
let c = fs.readFileSync(path, 'utf8');

const logoutFn = `
        // Cerrar sesion (mismo que curso_veo.html)
        function logout() {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userProducts');
            window.location.href = 'index.html';
        }
    `;

const marker = '    </script>';
const lastIdx = c.lastIndexOf(marker);
if (lastIdx > -1) {
    c = c.slice(0, lastIdx) + logoutFn + marker + c.slice(lastIdx + marker.length);
    fs.writeFileSync(path, c);
    console.log('OK - logout function added');
} else {
    console.log('NOT FOUND - marker missing');
    // Show last 200 chars to debug
    console.log(c.slice(-200));
}
