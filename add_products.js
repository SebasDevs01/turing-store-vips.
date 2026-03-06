const fs = require('fs');

// ── dashboard.html: add two new products ──────────────────────────────
let dash = fs.readFileSync('dashboard.html', 'utf8');
const anchor = '{ id: "GEM-006"';
const anchorFull = dash.indexOf(anchor);
const lineEnd = dash.indexOf('\n', anchorFull);
const insertAfter = dash.indexOf(';', lineEnd);  // after the closing ];

// Find the end of GEM-006 line and insert after it
const gem006end = dash.indexOf('\n', anchorFull); // end of line
const newProducts = `
            { id: "GEM-007", nombre: "Calculadora de Precios", desc: "Calcula el precio óptimo de venta para tu producto con márgenes reales, flete, IVA, utilidad y publicidad.", precio: 35000, img: "https://miembros.emanuelbolivar.com/wp-content/uploads/2025/11/18.avif", link: "calculadora_precios.html" },
            { id: "GEM-008", nombre: "Generador Link WhatsApp", desc: "Crea links directos de WhatsApp con mensaje pre-cargado para tus campañas de marketing y publicidad.", precio: 35000, img: "https://miembros.emanuelbolivar.com/wp-content/uploads/2025/11/MASTERLANDING-IA-4.avif", link: "generador_whatsapp.html" }`;

dash = dash.replace(
    '{ id: "GEM-006", nombre: "Tabla de Análisis de Productos", desc: "Evalúa cualquier producto con 20 criterios clave y obtén su porcentaje de viabilidad para testeo.", precio: 35000, img: "https://miembros.emanuelbolivar.com/wp-content/uploads/2025/11/19.avif", link: "tabla_analisis.html" }',
    '{ id: "GEM-006", nombre: "Tabla de Análisis de Productos", desc: "Evalúa cualquier producto con 20 criterios clave y obtén su porcentaje de viabilidad para testeo.", precio: 35000, img: "https://miembros.emanuelbolivar.com/wp-content/uploads/2025/11/19.avif", link: "tabla_analisis.html" },' + newProducts
);
fs.writeFileSync('dashboard.html', dash);
console.log('dashboard.html updated:', dash.includes('GEM-007') ? 'GEM-007 OK' : 'GEM-007 NOT FOUND', dash.includes('GEM-008') ? '| GEM-008 OK' : '| GEM-008 NOT FOUND');

// ── admin.html: add checkboxes for GEM-007 & GEM-008 ─────────────────
let admin = fs.readFileSync('admin.html', 'utf8');
const adminAnchor = 'tabla_analisis';
const adminAnchorIdx = admin.indexOf(adminAnchor);
if (adminAnchorIdx === -1) { console.log('admin.html: tabla_analisis not found'); }
else {
    // Find the line containing tabla_analisis and insert after it
    const lineEnd2 = admin.indexOf('\n', adminAnchorIdx);
    const newCheckboxes = `
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input type="checkbox" value="calculadora_precios.html" class="product-checkbox w-4 h-4 accent-red-600">
                    <span class="text-sm font-medium">GEM-007 – Calculadora de Precios</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <input type="checkbox" value="generador_whatsapp.html" class="product-checkbox w-4 h-4 accent-red-600">
                    <span class="text-sm font-medium">GEM-008 – Generador Link WhatsApp</span>
                </label>`;
    admin = admin.slice(0, lineEnd2) + newCheckboxes + admin.slice(lineEnd2);
    fs.writeFileSync('admin.html', admin);
    console.log('admin.html updated:', admin.includes('calculadora_precios') ? 'GEM-007 OK' : 'GEM-007 NOT FOUND');
}
