import { db, collection, query, where, getDocs, doc, getDoc, updateDoc } from '../JS/firebase.js';

// Variable global para almacenar el ID del administrador
let adminId;

// Función para obtener el ID del primer usuario con rol "Admin"
async function obtenerIdAdmin() {
    try {
        const usuariosCollectionRef = collection(db, 'usuarios');
        const adminQuery = query(usuariosCollectionRef, where('rol', '==', 'Admin'));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
            // Devuelve el ID del primer usuario encontrado con rol "Admin"
            return adminSnapshot.docs[0].id;
        } else {
            console.error('No se encontraron usuarios con rol "Admin".');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener ID de usuario con rol "Admin":', error);
        return null;
    }
}

// Función para obtener los datos del administrador por su ID
async function obtenerDatosAdmin(adminId) {
    try {
        const adminDocRef = doc(db, 'usuarios', adminId);
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
            return adminDoc.data();
        } else {
            console.error('No se encontraron datos para el administrador con ID:', adminId);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener datos del administrador:', error);
        return null;
    }
}

const formularioEdicion = document.getElementById('formulario-edicion');
// Función para mostrar el formulario de edición
function mostrarFormularioEdicion() {

    
    formularioEdicion.style.display = 'block';
}
const editarbtn = document.getElementById("editar")
editarbtn.addEventListener("click",async (e)=> {
    e.preventDefault();
    mostrarFormularioEdicion();
})

// Función para mostrar los datos del administrador en el contenedor
async function mostrarDatosAdmin() {
    try {
        // Obtener el ID del primer usuario con rol "Admin"
        adminId = await obtenerIdAdmin();

        if (adminId) {
            // Obtener y mostrar los datos del administrador
            const datosAdmin = await obtenerDatosAdmin(adminId);

            const nombreAdminElement = document.getElementById('nombre-admin');
            nombreAdminElement.textContent = `Nombre: ${datosAdmin.nombre}`;

            const apellidoPaternoAdminElement = document.getElementById('apellido-paterno-admin');
            apellidoPaternoAdminElement.textContent = `Apellido Paterno: ${datosAdmin.apellidoPaterno}`;

            const apellidoMaternoAdminElement = document.getElementById('apellido-materno-admin');
            apellidoMaternoAdminElement.textContent = `Apellido Materno: ${datosAdmin.apellidoMaterno}`;

            // Actualizar valores en el formulario de edición
            document.getElementById('nombre').value = datosAdmin.nombre;
            document.getElementById('apellido-paterno').value = datosAdmin.apellidoPaterno;
            document.getElementById('apellido-materno').value = datosAdmin.apellidoMaterno;
        }
    } catch (error) {
        console.error('Error al mostrar datos del administrador:', error);
    }
}


// Llamada inicial para mostrar los datos del administrador
mostrarDatosAdmin();

// Manejar la lógica de actualización al enviar el formulario
const formulario = document.getElementById('formulario');
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los nuevos valores del formulario
    const nuevoNombre = document.getElementById('nombre').value;
    const nuevoApellidoPaterno = document.getElementById('apellido-paterno').value;
    const nuevoApellidoMaterno = document.getElementById('apellido-materno').value;

    try {
        // Actualizar los datos del administrador en la base de datos
        await updateDoc(doc(db, 'usuarios', adminId), {
            nombre: nuevoNombre,
            apellidoPaterno: nuevoApellidoPaterno,
            apellidoMaterno: nuevoApellidoMaterno
        });

        // Actualizar los datos mostrados en el contenedor
        mostrarDatosAdmin();

        // Ocultar el formulario de edición después de actualizar
        document.getElementById('formulario-edicion').style.display = 'none';
    } catch (error) {
        console.error('Error al actualizar datos del administrador:', error);
    }
});
//Logica para cerrar el formulario si es que no se queria editar
const cerrarbtn = document.getElementById("cerrar");

cerrarbtn.addEventListener("click", async (e) => {
    e.preventDefault();

    formularioEdicion.style.display = 'none';
})