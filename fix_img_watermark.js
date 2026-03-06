const fs = require('fs');
let c = fs.readFileSync('dashboard.html', 'utf8');

// The product image: object-cover — shift to crop the top watermark
// Use object-position: center 18% to move image UP, cutting off the top ~18%
c = c.replace(
    'class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"',
    'class="w-full h-full object-cover object-[center_18%] transition-transform duration-700 group-hover:scale-105"'
);

fs.writeFileSync('dashboard.html', c);
console.log('Fixed:', c.includes('object-[center_18%]') ? 'OK' : 'NOT FOUND');
