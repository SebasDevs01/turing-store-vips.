const fs = require('fs');
let c = fs.readFileSync('admin.html', 'utf8');

// Fix 1: Change the inner flex wrapper - remove min-h-screen and use proper centering
c = c.replace(
    '<div class="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-6 overflow-y-auto">',
    '<div class="flex items-center justify-center w-full h-full px-4 py-6">'
);

// Fix 2: Change align-bottom to align-middle on the modal card
c = c.replace(
    'class="inline-block align-bottom bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full max-h-[88vh] flex flex-col"',
    'class="relative w-full max-w-lg bg-turingDarkCard rounded-2xl border border-red-900 shadow-[0_0_30px_rgba(230,57,70,0.3)] text-left overflow-hidden transform transition-all max-h-[88vh] flex flex-col"'
);

// Fix 3: Change the outer overlay to be a proper flex centering container  
c = c.replace(
    'class="hidden fixed z-50 inset-0 bg-black/60 ts-modal-overlay"',
    'class="hidden fixed z-50 inset-0 bg-black/60 ts-modal-overlay flex items-center justify-center"'
);

// Fix 4: Remove the inner duplicate backdrop (it creates double-dark overlay issues)
// The text-center on the wrapper causing alignment issues too
c = c.replace(
    '<div class="flex items-center justify-center w-full h-full px-4 py-6">',
    '<div class="w-full px-4">'
);

fs.writeFileSync('admin.html', c);
console.log('outer flex center:', c.includes('flex items-center justify-center"') ? 'OK' : 'CHECK');
console.log('relative card:', c.includes('"relative w-full max-w-lg') ? 'OK' : 'CHECK');
