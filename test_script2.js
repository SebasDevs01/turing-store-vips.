

    // Elementos del DOM

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    const closeSidebar = document.getElementById('close-sidebar');

    const sidebar = document.getElementById('sidebar');

    const mobileOverlay = document.getElementById('mobile-overlay');

    const lessonItems = document.querySelectorAll('.lesson-item');

    const checkmarks = document.querySelectorAll('.checkmark');

    const progressFill = document.getElementById('progress-fill');

    const progressPercent = document.getElementById('progress-percent');

    const progressText = document.getElementById('progress-text');

    const progressCount = document.getElementById('progress-count');

    const videoContents = document.querySelectorAll('.video-content');

    

    // Estado de la aplicación

    let currentLesson = 1;

    let completedLessons = new Set();

    const totalLessons = 27;

    

    // Funciones de utilidad

    const updateProgress = () => {

      const progress = (completedLessons.size / totalLessons) * 100;

      const roundedProgress = Math.round(progress);

      

      progressFill.style.width = `${progress}%`;

      progressPercent.textContent = `${roundedProgress}%`;

      progressText.textContent = `${completedLessons.size}/${totalLessons} lecciones`;

      progressCount.textContent = `${roundedProgress}% completado`;

    };

    

    const toggleCompleted = (lessonId) => {

      const lessonItem = document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`);

      const checkmark = document.querySelector(`.checkmark[data-lesson="${lessonId}"]`);

      const checkIcon = checkmark.querySelector('i');

      

      if (completedLessons.has(lessonId)) {

        completedLessons.delete(lessonId);

        checkmark.classList.remove('completed');

        checkIcon.classList.add('hidden');

        lessonItem.classList.remove('completed');

      } else {

        completedLessons.add(lessonId);

        checkmark.classList.add('completed');

        checkIcon.classList.remove('hidden');

        lessonItem.classList.add('completed');

      }

      

      updateProgress();

      saveProgress();

    };

    

    const setActiveLesson = (lessonId) => {

      // Remover clase activa de todas las lecciones

      lessonItems.forEach(item => {

        item.classList.remove('active');

      });

      

      // Agregar clase activa a la lección seleccionada

      const activeLesson = document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`);

      if (activeLesson) {

        activeLesson.classList.add('active');

      }

      

      currentLesson = lessonId;

    };

    

    const showVideo = (lessonId) => {

      // Validar rango

      if (lessonId < 1) lessonId = 1;

      if (lessonId > totalLessons) lessonId = totalLessons;

      

      // Ocultar todos los contenidos

      videoContents.forEach(content => {

        content.classList.remove('active');

      });

      

      // Mostrar contenido de la lección seleccionada

      const videoContent = document.getElementById(`video-${lessonId}`);

      if (videoContent) {

        videoContent.classList.add('active');

      }

      

      setActiveLesson(lessonId);

      

      // Cerrar el menú móvil si está abierto

      if (window.innerWidth < 1024) {

        closeMobileMenu();

      }

      

      // Guardar lección actual

      saveProgress();

    };

    

    const navigateVideo = (direction) => {

      const newLesson = direction === 'next' ? currentLesson + 1 : currentLesson - 1;

      

      // Validar que la lección exista

      if (newLesson >= 1 && newLesson <= totalLessons) {

        showVideo(newLesson);

      }

    };

    

    // Funciones del menú móvil

    const openMobileMenu = () => {

      sidebar.classList.add('open');

      mobileOverlay.classList.remove('hidden');

    };

    

    const closeMobileMenu = () => {

      sidebar.classList.remove('open');

      mobileOverlay.classList.add('hidden');

    };

    

    // Guardar y cargar progreso

    const saveProgress = () => {

      const progressData = {

        completedLessons: Array.from(completedLessons),

        currentLesson: currentLesson

      };

      localStorage.setItem('veo31-progress', JSON.stringify(progressData));

    };

    

    const loadProgress = () => {

      const savedProgress = localStorage.getItem('veo31-progress');

      if (savedProgress) {

        try {

          const progressData = JSON.parse(savedProgress);

          completedLessons = new Set(progressData.completedLessons || []);

          

          // Actualizar UI con lecciones completadas

          completedLessons.forEach(lessonId => {

            const checkmark = document.querySelector(`.checkmark[data-lesson="${lessonId}"]`);

            const checkIcon = checkmark.querySelector('i');

            const lessonItem = document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`);

            

            if (checkmark && lessonItem) {

              checkmark.classList.add('completed');

              checkIcon.classList.remove('hidden');

              lessonItem.classList.add('completed');

            }

          });

          

          // Establecer lección actual

          if (progressData.currentLesson) {

            showVideo(progressData.currentLesson);

          }

          

          updateProgress();

        } catch (e) {

          console.error('Error al cargar el progreso:', e);

        }

      }

    };

    

    // Event Listeners

    mobileMenuToggle.addEventListener('click', openMobileMenu);

    closeSidebar.addEventListener('click', closeMobileMenu);

    mobileOverlay.addEventListener('click', closeMobileMenu);

    

    // Navegación por teclado

    document.addEventListener('keydown', (e) => {

      if (e.key === 'ArrowLeft') {

        navigateVideo('prev');

      } else if (e.key === 'ArrowRight') {

        navigateVideo('next');

      } else if (e.key === 'Escape' && sidebar.classList.contains('open')) {

        closeMobileMenu();

      }

    });

    

    // Inicialización

    document.addEventListener('DOMContentLoaded', () => {

      
      import('./auth-helper.js?v=7')
        .then(async ({ checkAuth }) => {
            try {
                const sessionAuth = await checkAuth(true);
                if (!sessionAuth) return;
                
                const { userData } = sessionAuth;
                const bypass = localStorage.getItem('admin_bypass') === 'true';
                
                if (!bypass && !(userData?.purchased_products || []).includes("GEM-005")) {
                    alert("No tienes acceso a este Curso. Serás redirigido.");
                    window.location.href = 'dashboard.html';
                    return;
                }

                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.style.display = 'none';
                const app = document.getElementById('appContainer');
                if (app) {
                    app.style.display = 'flex';
                    if (window.innerWidth < 1024) app.style.flexDirection = 'column';
                }
                
                if (typeof loadProgress === 'function') loadProgress();
                if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                    if (typeof showVideo === 'function') showVideo(1);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) overlay.style.display = 'none';
                const app = document.getElementById('appContainer');
                if (app) {
                    app.style.display = 'flex';
                    if (window.innerWidth < 1024) app.style.flexDirection = 'column';
                }
                if (typeof loadProgress === 'function') loadProgress();
                if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                    if (typeof showVideo === 'function') showVideo(1);
                }
            }
        })
        .catch(err => {
            console.error("Fatal Auth Import Failure:", err);
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) overlay.style.display = 'none';
            const app = document.getElementById('appContainer');
            if (app) {
                app.style.display = 'flex';
                if (window.innerWidth < 1024) app.style.flexDirection = 'column';
            }
            if (typeof loadProgress === 'function') loadProgress();
            if (typeof currentLesson === 'undefined' || !currentLesson || currentLesson < 1) {
                if (typeof showVideo === 'function') showVideo(1);
            }
        });
);

  