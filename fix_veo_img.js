const fs = require('fs');

// Read and encode image
const imgData = fs.readFileSync('assets/cursoveo3.jpg');
const b64 = 'data:image/jpeg;base64,' + imgData.toString('base64');

let html = fs.readFileSync('dashboard.html', 'utf8');

// Find GEM-005 and precisely replace its img field
// Pattern: find GEM-005 object and replace img value
const before = html;
html = html.replace(
    /("GEM-005"[^}]*?img:\s*")([^"]*?)(")/s,
    (_, pre, _old, post) => pre + b64 + post
);

if (html === before) {
    console.log('ERROR: Pattern not found — checking structure...');
    const idx = before.indexOf('GEM-005');
    console.log('Context around GEM-005:', JSON.stringify(before.slice(idx, idx + 250)));
} else {
    fs.writeFileSync('dashboard.html', html);
    // Verify
    const idx2 = html.indexOf('GEM-005');
    const hasData = html.slice(idx2, idx2 + 300).includes('data:image');
    console.log('Success! data:image embedded:', hasData);
}
