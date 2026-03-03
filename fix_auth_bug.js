import fs from 'fs';
import path from 'path';

const authFile = './auth-helper.js';
let content = fs.readFileSync(authFile, 'utf8');

// The concurrency block in auth-helper starts at:
// `if (userData.current_session_token && currentLocalSessionToken && userData.current_session_token !== currentLocalSessionToken) {`
// If the user's role is 'admin', we shouldn't ban them!
// Notice `userData` is available.
const badConcurrencyLogic = `
                            if (userData.current_session_token && currentLocalSessionToken && userData.current_session_token !== currentLocalSessionToken) {
                                // If the database token doesn't match our local token, AND we didn't JUST log in,
                                // someone else took over the session.
                                if (!justLoggedIn) {
                                    try {
                                        // BLOQUEAR CUENTA y destuir sesiones activas para anular la intrusión detectada
                                        await updateDoc(userRef, {
                                            status: 'banned',
                                            current_session_token: null,
                                            last_ip_device: null
                                        });
                                    } catch (e) { }

                                    alert("¡INTRUSIÓN! Se ha detectado un inicio de sesión simultáneo en otro dispositivo. Por seguridad del ecosistema, tu cuenta ha sido BLOQUEADA automáticamente. Contacta al Admin.");
                                    await signOut(auth);
                                    localStorage.removeItem('sessionToken');
                                    window.location.href = redirectUrl;

                                    if (!isAuthResolved) {
                                        reject("Múltiples sesiones bloqueadas");
                                        isAuthResolved = true;
                                    }
                                    return;
                                }
                            }
`;

const safeConcurrencyLogic = `
                            if (userData.current_session_token && currentLocalSessionToken && userData.current_session_token !== currentLocalSessionToken) {
                                // If the database token doesn't match our local token, AND we didn't JUST log in,
                                // someone else took over the session.
                                if (!justLoggedIn) {
                                    if (userData.role !== 'admin') {
                                        try {
                                            // BLOQUEAR CUENTA y destuir sesiones activas para anular la intrusión detectada
                                            await updateDoc(userRef, {
                                                status: 'banned',
                                                current_session_token: null,
                                                last_ip_device: null
                                            });
                                        } catch (e) { }

                                        alert("¡INTRUSIÓN! Se ha detectado un inicio de sesión simultáneo en otro dispositivo. Por seguridad del ecosistema, tu cuenta ha sido BLOQUEADA automáticamente. Contacta al Admin.");
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
`;

content = content.replace(badConcurrencyLogic.trim(), safeConcurrencyLogic.trim());
fs.writeFileSync(authFile, content);
console.log('Fixed auto-ban bug for admins.');
