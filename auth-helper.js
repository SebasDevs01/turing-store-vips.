import { auth, db, doc, getDoc, onAuthStateChanged, signOut, updateDoc, onSnapshot } from './firebase-config.js?v=3';

// Función para verificar la sesión y redirigir si es necesario
export function checkAuth(requireAuth = true, redirectUrl = 'login.html') {
    return new Promise((resolve, reject) => {
        // Admin Bypass
        if (localStorage.getItem('admin_bypass') === 'true') {
            if (window.location.pathname.includes('admin')) {
                resolve({ user: { uid: 'admin_bypass', email: 'admin1' }, userData: { status: 'active', role: 'admin' } });
                return;
            } else if (!requireAuth) {
                window.location.href = 'admin.html';
                resolve(null);
                return;
            }
        } else if (window.location.pathname.includes('admin') && requireAuth) {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    window.location.href = redirectUrl;
                    reject("No autenticado");
                    return;
                }
            });
        }

        let isAuthResolved = false;
        let userListenerUnsubscribe = null;

        onAuthStateChanged(auth, async (user) => {
            if (requireAuth) {
                if (user) {
                    const userRef = doc(db, "users", user.uid);

                    if (userListenerUnsubscribe) userListenerUnsubscribe();

                    userListenerUnsubscribe = onSnapshot(userRef, async (userSnap) => {
                        if (userSnap.exists()) {
                            const userData = userSnap.data();

                            // 1. Verificación estado activo en tiempo real
                            if (userData.status !== 'active' && !window.location.pathname.includes('admin')) {
                                if (!isAuthResolved) {
                                    alert("Tu cuenta no está activada o ha sido bloqueada. Contacta al soporte.");
                                    await signOut(auth);
                                    window.location.href = redirectUrl;
                                    reject("Cuenta inactiva");
                                    isAuthResolved = true;
                                } else {
                                    alert("El administrador ha bloqueado tu cuenta repentinamente.");
                                    await signOut(auth);
                                    window.location.href = redirectUrl;
                                }
                                return;
                            }

                            // ── PRIMERA VEZ: establecer sesión ────────────────────────────────
                            if (!isAuthResolved) {
                                let sessionToken = localStorage.getItem('sessionToken');
                                const justLoggedIn = localStorage.getItem('justLoggedIn');

                                // Si acabamos de hacer login, ya tenemos un token nuevo en localStorage
                                // Solo necesitamos escribirlo a Firestore
                                if (!sessionToken) {
                                    sessionToken = Math.random().toString(36).substring(2, 15);
                                    localStorage.setItem('sessionToken', sessionToken);
                                }

                                // Recopilar info del dispositivo
                                let deviceInfo = "Navegador Web";
                                if (/android/i.test(navigator.userAgent)) deviceInfo = "Android Móvil";
                                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) deviceInfo = "iPhone/iPad";
                                if (/Windows/.test(navigator.userAgent)) deviceInfo = "Windows PC";
                                if (/Mac OS X/.test(navigator.userAgent)) deviceInfo = "Mac OS";

                                let realIp = "IP Oculta";
                                try {
                                    const res = await fetch('https://api.ipify.org?format=json');
                                    const data = await res.json();
                                    realIp = data.ip;
                                } catch (e) {
                                    console.warn("IP tracking ad-blocked", e);
                                }

                                const logData = `IP: ${realIp} | ${deviceInfo} - ${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`;

                                // Escribir token a Firestore (siempre al inicio de sesión)
                                try {
                                    await updateDoc(userRef, {
                                        current_session_token: sessionToken,
                                        last_ip_device: logData,
                                        last_login: new Date()
                                    });
                                } catch (e) {
                                    console.warn("Error tracking session", e);
                                }

                                if (justLoggedIn) localStorage.removeItem('justLoggedIn');

                                resolve({ user, userData });
                                isAuthResolved = true;
                                return;
                            }

                            // ── ACTUALIZACIONES EN TIEMPO REAL (después del primer resolve) ──
                            // Detectar si alguien más tomó la sesión
                            const currentLocalSessionToken = localStorage.getItem('sessionToken');

                            if (
                                userData.current_session_token &&
                                currentLocalSessionToken &&
                                userData.current_session_token !== currentLocalSessionToken
                            ) {
                                // Token en Firestore cambió — otro dispositivo inició sesión
                                if (userData.role !== 'admin') {
                                    try {
                                        await updateDoc(userRef, {
                                            status: 'banned',
                                            current_session_token: null,
                                            last_ip_device: null
                                        });
                                    } catch (error) {
                                        console.error("Error al banear usuario por sesión múltiple:", error);
                                    }

                                    alert("⚠️ SESIÓN DUPLICADA: Se detectó un inicio de sesión en otro dispositivo. Por seguridad, tu cuenta ha sido BLOQUEADA. Contacta al Admin.");

                                    await signOut(auth);
                                    localStorage.removeItem('sessionToken');
                                    window.location.href = redirectUrl;
                                    return;
                                } else {
                                    // Admin: no baneamos, solo sincronizamos
                                    console.log("Sesión simultánea en Admin — sincronizando token.");
                                    localStorage.setItem('sessionToken', userData.current_session_token);
                                }
                            }

                            // Token en Firestore fue borrado (null) — sesión destruida desde admin
                            if (!userData.current_session_token && currentLocalSessionToken) {
                                alert("Tu sesión fue cerrada por el administrador.");
                                await signOut(auth);
                                localStorage.removeItem('sessionToken');
                                window.location.href = redirectUrl;
                            }

                        } else {
                            // El documento no existe o fue ELIMINADO en tiempo real
                            console.warn("Cuenta eliminada de la Base de Datos");
                            if (!window.location.pathname.includes('registro') && !window.location.pathname.includes('login')) {
                                alert("Tu cuenta ha sido eliminada permanentemente por el Administrador.");
                            }
                            await signOut(auth);
                            localStorage.removeItem('sessionToken');
                            window.location.href = redirectUrl;

                            if (!isAuthResolved) {
                                reject("Usuario eliminado de Firestore");
                                isAuthResolved = true;
                            }
                        }
                    });
                } else {
                    window.location.href = redirectUrl;
                    if (!isAuthResolved) reject("No autenticado");
                }
            } else {
                if (user && !window.location.pathname.includes('admin')) {
                    window.location.href = 'dashboard.html';
                }
                if (!isAuthResolved) resolve(null);
            }
        });
    });
}

// Función para manejar el logout universal
export async function handleLogout() {
    try {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                current_session_token: null,
                last_ip_device: null
            });
        }
        localStorage.removeItem('admin_bypass');
        await signOut(auth);
        localStorage.removeItem('sessionToken');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
}
