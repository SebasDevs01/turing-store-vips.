const fs = require('fs');
let c = fs.readFileSync('admin.html', 'utf8');

// Fix the inner modal card: add max-h and flex flex-col
c = c.replace(
    'class="inline-block align-bottom bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[90vh] flex flex-col"',
    'class="inline-block align-bottom bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full max-h-[88vh] flex flex-col"'
);

// Fix the products container div to be scrollable
c = c.replace(
    '<div class="px-6 py-4 bg-black/30">',
    '<div class="px-6 py-4 bg-black/30 overflow-y-auto flex-1">'
);

fs.writeFileSync('admin.html', c);

// Verify
const inner = c.indexOf('max-h-[88vh]');
const scroll = c.indexOf('overflow-y-auto flex-1');
console.log('max-h on card:', inner > 0 ? 'OK' : 'NOT FOUND');
console.log('scrollable list:', scroll > 0 ? 'OK' : 'NOT FOUND');
