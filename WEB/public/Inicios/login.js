// login.js
import {auth, signInWithEmailAndPassword, sendPasswordResetEmail, query, where, db, collection, getDocs} from "../JS/firebase.js"


const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        // Si el inicio de sesión es exitoso, puedes obtener los datos del usuario
        const user = userCredential.user;
        const uid = user.uid;
        const userDocRef = collection(db, 'usuarios');
        const userQuery = query(userDocRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(userQuery);
      
        querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            const datos = userData;
            console.log('Datos del usuario:', datos);
            
            if (datos) {
                window.location.href = "../Principal/mainU.html"; // Redirige aquí, dentro del forEach
            } else {
                console.log('No se encontraron datos para el usuario:', user.uid);
                // Podrías manejar este caso específico, por ejemplo, mostrar un mensaje de error o redirigir a otra página de error.
            }
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        // Manejar el error aquí
    }
});

const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

forgotPasswordBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = prompt('Por favor, ingresa tu correo electrónico para restablecer la contraseña:');
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            // Si el envío del correo es exitoso, mostrar un mensaje al usuario
            console.log('Correo enviado para restablecer la contraseña.');
            alert('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
        } catch (error) {
            // En caso de error al enviar el correo
            console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
            alert('Hubo un problema al enviar el correo de restablecimiento de contraseña. Por favor, intenta de nuevo.');
        }
    }
});
 