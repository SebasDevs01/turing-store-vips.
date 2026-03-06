const fs = require('fs');
let admin = fs.readFileSync('admin.html', 'utf8');

// Replace the last product in the masterProducts array
admin = admin.replace(
    '{ id: "GEM-006", name: "Tabla de Análisis de Productos" }',
    '{ id: "GEM-006", name: "Tabla de Análisis de Productos" },\n            { id: "GEM-007", name: "Calculadora de Precios" },\n            { id: "GEM-008", name: "Generador Link WhatsApp" }'
);

fs.writeFileSync('admin.html', admin);
console.log('admin.html GEM-007:', admin.includes('GEM-007') ? 'OK' : 'NOT FOUND');
console.log('admin.html GEM-008:', admin.includes('GEM-008') ? 'OK' : 'NOT FOUND');
