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
            // Si intenta entrar al admin y no tiene el bypass, redirigir
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

                            // 2. Verificación Múltiples Sesiones (Baneo Automático)
                            const currentLocalSessionToken = localStorage.getItem('sessionToken');
                            const justLoggedIn = localStorage.getItem('justLoggedIn');

                            if (userData.current_session_token && currentLocalSessionToken && userData.current_session_token !== currentLocalSessionToken) {
                                // If the database token doesn't match our local token, AND we didn't JUST log in,
                                // someone else took over the session.
                                if (!justLoggedIn) {
                                    if (userData.role !== 'admin') {
                                        let banSuccessful = false;
                                        try {
                                            // BLOQUEAR CUENTA y destuir sesiones activas para anular la intrusión detectada
                                            // Make sure we await this properly AND catch any errors separately so it doesn't abort.
                                            await updateDoc(userRef, {
                                                status: 'banned',
                                                current_session_token: null,
                                                last_ip_device: null
                                            });
                                            banSuccessful = true;
                                        } catch (error) {
                                            console.error("Error al banear usuario por sesión múltiple:", error);
                                        }

                                        // Only alert AFTER the network request to ban has completed or explicitly failed.
                                        alert("¡INTRUSIÓN! Se ha detectado un inicio de sesión simultáneo en otro dispositivo. Por seguridad del ecosistema, tu cuenta ha sido BLOQUEADA automáticamente. Contacta al Admin.");

                                        // Now it is safe to tear down the local auth state.
                                        await signOut(auth);
                                        localStorage.removeItem('sessionToken');
                                        window.location.href = redirectUrl;

                                        if (!isAuthResolved) {
                                            reject("Múltiples sesiones bloqueadas");
                                            isAuthResolved = true;
                                        }
                                        return;
                                    } else {
                                        // Es Admin, se permite múltiples sesiones o al menos NO los baneamos.
                                        console.log("Sesión simultánea detectada en cuenta Admin. Baneo omitido por privilegios.");
                                        // Podemos actualizar su token local al más nuevo para que no los eche.
                                        localStorage.setItem('sessionToken', userData.current_session_token);
                                    }
                                }
                            }

                            if (justLoggedIn) {
                                localStorage.removeItem('justLoggedIn');
                            }

                            // Solo actualizamos la IP y Token cuando la promesa original se está resolviendo la 1ra vez
                            if (!isAuthResolved) {
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

                                let sessionToken = currentLocalSessionToken;
                                if (!sessionToken) {
                                    sessionToken = Math.random().toString(36).substring(2, 15);
                                    localStorage.setItem('sessionToken', sessionToken);
                                }

                                // Evitar loops de snapshot
                                if (userData.current_session_token !== sessionToken || userData.last_ip_device !== logData) {
                                    try {
                                        await updateDoc(userRef, {
                                            current_session_token: sessionToken,
                                            last_ip_device: logData,
                                            last_login: new Date()
                                        });
                                    } catch (e) {
                                        console.warn("Error tracking session", e);
                                    }
                                }

                                resolve({ user, userData });
                                isAuthResolved = true;
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
            // Nullify the session securely so the admin panel shows "Sin conexión"
            // and the previous session token allows immediate logins elsewhere
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
