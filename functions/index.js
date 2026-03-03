const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializa el Admin SDK
admin.initializeApp();

// Función que se dispara cuando se borra un documento en la colección "users" en Firestore
exports.onUserDeleted = functions.firestore
    .document('users/{userId}')
    .onDelete(async (snap, context) => {
        const userId = context.params.userId;
        try {
            // Eliminar el usuario de Firebase Auth
            await admin.auth().deleteUser(userId);
            console.log(`Usuario eliminado correctamente de Auth: ${userId}`);
        } catch (error) {
            console.error(`Error al eliminar usuario ${userId} de Auth:`, error);
        }
    });
