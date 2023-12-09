import {db, collection, getDocs, query, where} from './firebase.js';
async function obtenerUsuariosExceptoAdmin() {
    try {
        const usuariosCollectionRef = collection(db, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollectionRef);

        for (const doc of usuariosSnapshot.docs) {
            const usuario = doc.data();

            // Verifica si el usuario no es administrador antes de agregarlo a la tabla
            if (usuario.rol !== 'Admin') {
                const tablaUsuarios = document.getElementById('usuarios-body');
                const fila = document.createElement('tr');

                // Obtener reportes del usuario actual
                const reportesQuery = query(
                    collection(db, 'reportes'),
                    where('uidUsuario', '==', doc.id)
                );
                const reportesSnapshot = await getDocs(reportesQuery);
                const numReportes = reportesSnapshot.size;

                fila.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidoPaterno}</td>
                    <td>${usuario.apellidoMaterno}</td>
                    <td>${numReportes}</td> <!-- Agrega la columna de número de reportes -->
                `;
                tablaUsuarios.appendChild(fila);
            }
        }
    } catch (error) {
        console.error('Error al obtener y mostrar usuarios:', error);
    }
}


// Llamada inicial para mostrar los usuarios
obtenerUsuariosExceptoAdmin();