const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'archivos txt', 'paginaveo3.txt');
const content = fs.readFileSync(filePath, 'utf-8');

// Looking for modules and lessons
// Elementor accordions usually have <a class="elementor-accordion-title"...>
// Or headings <h2 class="elementor-heading-title"...>

const results = [];
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('iframe') || line.includes('Módulo') || line.includes('Modulo') || line.includes('Lección') || line.includes('Leccion') || line.includes('elementor-accordion-title') || line.includes('elementor-heading-title')) {
        results.push(line);
    }
}

fs.writeFileSync(path.join(__dirname, 'archivos txt', 'extracted_structure.txt'), results.join('\n'));
console.log(`Extracted ${results.length} lines.`);
