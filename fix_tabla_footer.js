const fs = require('fs');
const path = 'tabla_analisis.html';
let c = fs.readFileSync(path, 'utf8');

// Find old footer div and replace with dashboard exact footer
const footerStart = c.indexOf('<div class="mt-6 pt-4 border-t');
const footerEnd = c.indexOf('</div>', footerStart) + 6;

const dashboardFooter = `<footer class="border-t border-gray-800/50 mt-8 py-6 px-4">
        <div class="max-w-7xl mx-auto text-center text-xs text-gray-500 space-y-1">
            <p>
                <span class="text-turingRed font-bold uppercase tracking-widest">Turing Store</span>
                &nbsp;·&nbsp; Área exclusiva para miembros VIP
            </p>
            <p>© 2026 Turing Store · Todos los derechos reservados · Acceso restringido</p>
        </div>
    </footer>`;

if (footerStart > -1) {
    c = c.slice(0, footerStart) + dashboardFooter + c.slice(footerEnd);
    fs.writeFileSync(path, c);
    console.log('Footer replaced OK');
} else {
    console.log('OLD FOOTER NOT FOUND — searching alternative...');
    // Try looking for any footer-like div near end
    const altStart = c.lastIndexOf('<div class="mt-');
    console.log('Alt position:', altStart);
    console.log(c.slice(altStart, altStart + 200));
}
