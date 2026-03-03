const fs = require('fs');
const path = require('path');

const dPath = path.join(__dirname, 'dashboard.html');
const dashboardHTML = fs.readFileSync(dPath, 'utf8');

// The Turing store logo is likely an img tag inside the header or navigation
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
const match = imgRegex.exec(dashboardHTML);

const logoUrl = match ? match[1] : '';
console.log('Found Turing Store logo URL:', logoUrl);

// Write it to a temp txt file so I can view it
fs.writeFileSync(path.join(__dirname, 'turing_logo_extract.txt'), `Logo URL: ${logoUrl}\n`);
