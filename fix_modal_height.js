const fs = require('fs');
let c = fs.readFileSync('admin.html', 'utf8');

// Fix the modal container to be fixed overlay centered, not min-h-screen
c = c.replace(
    '<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-10 text-center sm:p-0 overflow-y-auto">',
    '<div class="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-6">'
);

// Fix the inner modal card to have max-height and scroll
c = c.replace(
    'class="inline-block align-bottom bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"',
    'class="inline-block align-bottom bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[90vh] flex flex-col"'
);

// Make the products list scrollable (the div that contains checkboxes)
// Find the product list container and add overflow-y-auto and flex-1 to it
c = c.replace(
    'class="p-6 overflow-y-auto max-h-96"',
    'class="p-6 overflow-y-auto flex-1"'
);
// Also try alternative class name
if (!c.includes('overflow-y-auto flex-1')) {
    // Find the scrollable product area
    const listIdx = c.indexOf('product-checkbox');
    const parentDiv = c.lastIndexOf('<div class=', listIdx);
    console.log('product area at:', parentDiv);
    console.log(c.slice(parentDiv, parentDiv + 100));
}

fs.writeFileSync('admin.html', c);
console.log('Done');
