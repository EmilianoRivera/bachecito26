// Importa las funciones necesarias de tu archivo firebase.js
import { createUserWithEmailAndPassword, sendEmailVerification, auth, db, collection, addDoc } from "../JS/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  // Obtén referencias a los elementos del DOM
  var nombreInput = document.getElementById("nombre");
  var appatInput = document.getElementById("appat");
  var apmatInput = document.getElementById("apmat");
  var nacimientoInput = document.getElementById("nacimiento");
  var usernameInput = document.getElementById("username");
  var passwordInput = document.getElementById("password");

  var formulario = document.getElementById("loginForm");

  // Maneja el envío del formulario
  formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Obtiene el valor del checkbox
    var termsCheckbox = document.getElementById("termsCheckbox");

    // Verifica si el checkbox está marcado
    if (!termsCheckbox.checked) {
      alert("Debes aceptar el Aviso de Privacidad y los Términos y Condiciones para poder crear una cuenta.");
      return; // Detiene el proceso de registro
    }
    
    // Obtiene los valores de los campos
    var nombre = nombreInput.value;
    var appat = appatInput.value;
    var apmat = apmatInput.value;
    var nacimiento = nacimientoInput.value;
    var email = usernameInput.value; // Cambiado de 'username' a 'email' para que coincida con tu formulario
    var password = passwordInput.value;

    try {
      // Crea la cuenta de usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Envía correo de verificación
      await sendEmailVerification(user);

      // Registra los datos del nuevo usuario en la base de datos
      const usuariosCollection = collection(db, 'usuarios');
      const nuevoUsuario = {
        uid: uid,
        nombre: nombre,
        apellidoPaterno: appat,
        apellidoMaterno: apmat,
        fechaNacimiento: nacimiento,
        correo: email,
      };

      await addDoc(usuariosCollection, nuevoUsuario);

      console.log('Datos del nuevo usuario guardados en la base de datos');
      alert('Registro exitoso. Se ha enviado un correo de verificación.');
      window.location.href = "../Inicios/Inicio.html"; 
      // Puedes agregar más lógica aquí, como redirigir a otra página, etc.
    } catch (error) {
      console.error('Error en el proceso de registro:', error);
      alert('Hubo un error en el proceso de registro. Por favor, inténtalo de nuevo.');
    }
  });
});
