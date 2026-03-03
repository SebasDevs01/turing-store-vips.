const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'curso_veo.html');
let content = fs.readFileSync(srcFile, 'utf8');

// 1. Reemplazar Logos y Textos
// Remove avatar img and replace with Turing Store logo/icon
content = content.replace(/<img[^>]+src="[^"]+Diseno-sin-titulo[^>]+>/g, '<i class="fas fa-laptop-code text-premium-primary text-3xl"></i>');
content = content.replace(/EmanuelBolivar\.ecom/g, 'Turing Store');

// 2. Modificar el tailwind.config
const newTailwindConfig = `
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            premium: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-secondary)',
              background: 'var(--color-bg)',
              card: 'var(--color-card)',
              border: 'var(--color-border)',
              text: 'var(--color-text)',
              textMuted: 'var(--color-muted)'
            }
          },
          fontFamily: {
            'sans': ['Inter', 'system-ui', 'sans-serif'],
          }
        }
      }
`;
content = content.replace(/darkMode:\s*'class',[\s\S]*?fontFamily:/, newTailwindConfig.split('fontFamily:')[0] + 'fontFamily:');

// 3. Modificar la hoja de estilos <style>
const newStyles = `
    :root {
      /* Modo Claro (Default) */
      --color-primary: #dc2626; /* Rojo Turing */
      --color-secondary: #991b1b;
      --color-bg: #f8fafc;
      --color-card: #ffffff;
      --color-border: #e2e8f0;
      --color-text: #0f172a;
      --color-muted: #64748b;
      --color-glass: rgba(255, 255, 255, 0.8);
      --shadow-primary: rgba(220, 38, 38, 0.3);
    }
    
    .dark {
      /* Modo Oscuro */
      --color-primary: #dc2626; /* Rojo Turing */
      --color-secondary: #991b1b;
      --color-bg: #000000;
      --color-card: #111111;
      --color-border: #333333;
      --color-text: #f8fafc;
      --color-muted: #94a3b8;
      --color-glass: rgba(17, 17, 17, 0.8);
      --shadow-primary: rgba(220, 38, 38, 0.4);
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--color-bg);
      color: var(--color-text);
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .sidebar {
      background-color: var(--color-card);
      border-right: 1px solid var(--color-border);
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .lesson-item {
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      background: transparent;
    }

    .lesson-item:hover {
      background: rgba(220, 38, 38, 0.05);
    }

    .lesson-item.active {
      background: rgba(220, 38, 38, 0.1);
      border-left-color: var(--color-primary);
    }

    .lesson-item.completed .lesson-number {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: #ffffff;
      box-shadow: 0 0 15px var(--shadow-primary);
    }

    .lesson-number {
      background: var(--color-border);
      color: var(--color-muted);
      transition: all 0.3s ease;
    }

    .module-title {
      background: var(--color-card);
      color: var(--color-primary);
      font-weight: 600;
      border-bottom: 1px solid var(--color-border);
    }

    .video-container {
      background: var(--color-card);
      border-radius: 12px;
      border: 1px solid var(--color-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .video-header {
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
      color: #ffffff;
    }

    .video-header .text-premium-background {
      color: rgba(255,255,255, 0.9) !important;
    }

    .progress-bar {
      background: var(--color-border);
      border-radius: 10px;
      overflow: hidden;
    }

    .progress-fill {
      background: linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%);
      height: 8px;
      border-radius: 10px;
      transition: width 0.5s ease;
      box-shadow: 0 0 10px var(--shadow-primary);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px var(--shadow-primary);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px var(--shadow-primary);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-outline:hover {
      background: rgba(220, 38, 38, 0.1);
      box-shadow: 0 0 15px var(--shadow-primary);
    }

    .download-card {
      background: var(--color-card);
      border-radius: 10px;
      border: 1px solid var(--color-border);
      transition: all 0.3s ease;
    }

    .download-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-primary);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .checkmark {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .checkmark.completed {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
      color: #ffffff;
      box-shadow: 0 0 10px var(--shadow-primary);
    }

    .glow-text {
      text-shadow: 0 0 10px var(--shadow-primary);
    }

    .video-content {
      display: none;
    }

    .video-content.active {
      display: block;
      animation: fadeIn 0.5s ease-in;
    }

    @media (max-width: 1023px) {
      .sidebar-mobile {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      .sidebar-mobile.open {
        transform: translateX(0);
      }
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--color-card);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--color-primary);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-secondary);
    }
`;

content = content.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + newStyles + '\n  </style>');

// 4. Modificar clases Tailwind text-white a text-premium-text, y similares para soportar Claro/Oscuro dinámicamente
content = content.replace(/text-white/g, 'text-premium-text');
content = content.replace(/text-gray-400/g, 'text-premium-textMuted');
content = content.replace(/text-gray-300/g, 'text-premium-textMuted');

// Fix un par de cosas específicas:
content = content.replace(/bg-black bg-opacity-70/g, 'bg-black/70 backdrop-blur-sm');
// Loading overlay
content = content.replace(/background: #0a0f1c;/g, 'background: var(--color-bg);');

// 5. Agregar el botón de Toggle de Tema
const themeToggleHTML = `
  <button id="theme-toggle" class="p-2 mr-3 rounded-lg text-premium-text bg-premium-card border border-premium-border hover:bg-premium-primary hover:text-white transition-all">
    <i class="fas fa-sun dark:hidden"></i>
    <i class="fas fa-moon hidden dark:inline"></i>
  </button>
`;

content = content.replace(/<div class="flex items-center space-x-4">/g, '<div class="flex items-center space-x-4">' + themeToggleHTML);

// 6. Agregar script para manejar el Dark/Light mode
const themeScript = `
    <script>
      const themeToggleBtn = document.getElementById('theme-toggle');
      const htmlElement = document.documentElement;

      function updateTheme() {
        if (htmlElement.classList.contains('dark')) {
          htmlElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          htmlElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      }

      // Evita parpadeos asignando el tema inicial en el head si fuera posible, pero lo hacemos aquí
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', updateTheme);
      }
    </script>
`;

// Insert it right after the body tag or end of body
content = content.replace(/<\/body>/, themeScript + '\n</body>');

fs.writeFileSync(srcFile, content);
console.log('Fixed Refactoring script executed properly.');
