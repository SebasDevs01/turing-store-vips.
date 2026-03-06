const fs = require('fs');
let c = fs.readFileSync('admin.html', 'utf8');

// Fix 1: Add bg-black/60 to the modal overlay div (the outer fixed div)
c = c.replace(
    'class="hidden fixed z-50 inset-0 overflow-y-auto ts-modal-overlay"',
    'class="hidden fixed z-50 inset-0 bg-black/60 ts-modal-overlay"'
);

// Fix 2: The inner flex div should handle the scrolling, not the outer
// Replace the inner flex div to enable scrolling properly
c = c.replace(
    '<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0"',
    '<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-10 text-center sm:p-0 overflow-y-auto"'
);

fs.writeFileSync('admin.html', c);
console.log('Fixed:', c.includes('bg-black/60') ? 'overlay bg OK' : 'NOT FOUND');
