import { auth, db, doc, getDoc, onAuthStateChanged, signOut, updateDoc } from './firebase-config.js?v=3';

// Función para verificar la sesión y redirigir si es necesario
export function checkAuth(requireAuth = true, redirectUrl = 'login.html') {
    return new Promise((resolve, reject) => {
        // Admin Bypass
        if (localStorage.getItem('admin_bypass') === 'true') {
            if (window.location.pathname.includes('admin.html')) {
                resolve({ user: { uid: 'admin_bypass', email: 'admin1' }, userData: { status: 'active', role: 'admin' } });
                return;
            } else if (!requireAuth) {
                window.location.href = 'admin.html';
                resolve(null);
                return;
            }
        } else if (window.location.pathname.includes('admin.html') && requireAuth) {
            // Si intenta entrar al admin y no tiene el bypass, redirigir
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    window.location.href = redirectUrl;
                    reject("No autenticado");
                    return;
                }
            });
        }

        onAuthStateChanged(auth, async (user) => {
            if (requireAuth) {
                if (user) {
                    // Verificar si el usuario está activo y comprobar la IP (simulada por sesión)
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data();

                        // Verificar estado activo
                        if (userData.status !== 'active' && !window.location.pathname.includes('admin.html')) {
                            alert("Tu cuenta no está activada o ha sido suspendida. Contacta al administrador.");
                            await signOut(auth);
                            window.location.href = redirectUrl;
                            reject("Cuenta inactiva");
                            return;
                        }

                        // Verificación de Sesión Única (IP Simulación)
                        // En un entorno real estático, generamos un token de sesión en localStorage
                        // y lo comparamos con el de Firestore. Si no coincide, alguien más se conectó.
                        const currentLocalSessionToken = localStorage.getItem('sessionToken');
                        if (userData.current_session_token && userData.current_session_token !== currentLocalSessionToken) {
                            alert("Se ha detectado un inicio de sesión desde otro dispositivo. Tu sesión ha sido cerrada por seguridad.");
                            await signOut(auth);
                            localStorage.removeItem('sessionToken');
                            window.location.href = redirectUrl;
                            reject("Múltiples sesiones detectadas");
                            return;
                        }

                        resolve({ user, userData });
                    } else {
                        // Usuario autenticado pero sin registro en Firestore (raro, pero posible si falla el registro)
                        await signOut(auth);
                        window.location.href = redirectUrl;
                        reject("Usuario no encontrado en la base de datos");
                    }
                } else {
                    window.location.href = redirectUrl;
                    reject("No autenticado");
                }
            } else {
                // Si no requiere auth (ej: página de login), redirigir al dashboard si ya está logueado
                if (user) {
                    // Solo redirigimos si NO estamos en admin.html manual
                    if (!window.location.pathname.includes('admin.html')) {
                        window.location.href = 'dashboard.html';
                    }
                }
                resolve(null);
            }
        });
    });
}

// Función para manejar el logout universal
export async function handleLogout() {
    try {
        localStorage.removeItem('admin_bypass');
        await signOut(auth);
        localStorage.removeItem('sessionToken');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
}
