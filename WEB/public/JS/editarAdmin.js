import { db, collection, getDocs, updateDoc, query, where } from '../JS/firebase.js';

// Obtener datos de usuarios con rol "admin"
const obtenerAdmins = async () => {
    try {
        const adminsCollectionRef = collection(db, 'usuarios');
        const adminsQuery = query(adminsCollectionRef, where('rol', '==', 'admin'));
        const snapshot = await getDocs(adminsQuery);

        const admins = [];
        snapshot.forEach((doc) => {
            admins.push({
                id: doc.id,
                data: doc.data()
            });
        });

        return admins;
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        throw error;
    }
};
    
// Mostrar administradores en el contenedor
const mostrarAdministradores = async () => {
    try {
        const administradoresContainer = document.getElementById('editar-admin-form');
        const admins = await obtenerAdmins();

        administradoresContainer.innerHTML = ''; // Limpiar el contenido anterior

        admins.forEach((admin) => {
            administradoresContainer.innerHTML += `
                <div class="administrador">
                    <p>ID: ${admin.id}</p>
                    <p>Nombre: ${admin.data.nombre}</p>
                    <p>Correo: ${admin.data.correo}</p>
                    <!-- Agregar más campos según sea necesario -->

                    <!-- Botón para modificar datos -->
                    <button onclick="modificarDatos('${admin.id}')">Modificar Datos</button>
                </div>`;
        });
    } catch (error) {
        console.error('Error al mostrar administradores:', error);
    }
};

// Función para modificar datos de un administrador
const modificarDatos = async (adminId) => {
    try {
        // Aquí puedes implementar la lógica para modificar los datos del administrador
        // Por ejemplo, podrías abrir un formulario de edición o hacer una llamada a otra función

        console.log(`Modificar datos del administrador con ID: ${adminId}`);
    } catch (error) {
        console.error('Error al modificar datos del administrador:', error);
    }
};

// Llama a la función para mostrar los administradores al cargar la página
mostrarAdministradores();


const mostrarFormularioEdicion = (adminId) => {
    const formularioEdicion = document.getElementById('editar-admin-form');
    formularioEdicion.style.display = 'block';

    const formularioEditar = document.getElementById('formulario-editar');
    formularioEditar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoNombre = document.getElementById('editar-nombre').value;
        const nuevoApellidoPaterno = document.getElementById('editar-appat').value;
        const nuevoApellidoMaterno = document.getElementById('editar-apmat').value;

        try {
            // Actualizar datos en la base de datos
            await updateDoc(collection(db, 'usuarios', adminId), {
                nombre: nuevoNombre,
                apellidoPaterno: nuevoApellidoPaterno,
                apellidoMaterno: nuevoApellidoMaterno
            });

            console.log('Datos del administrador actualizados correctamente.');

            // Ocultar el formulario de edición después de actualizar
            formularioEdicion.style.display = 'none';

            // Volver a mostrar la lista actualizada de administradores
            mostrarAdministradores();
        } catch (error) {
            console.error('Error al actualizar datos del administrador:', error);
        }
    });
};

// Llama a la función para mostrar los administradores al cargar la página
mostrarAdministradores();