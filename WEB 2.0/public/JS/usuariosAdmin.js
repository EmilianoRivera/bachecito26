import { db, collection, getDocs, query, where } from './firebase.js';

async function obtenerUsuariosExceptoAdmin() {
    try {
        const usuariosCollectionRef = collection(db, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollectionRef);

        const tablaUsuarios = document.getElementById('usuarios-body');
        let contadorReportes = 1;  // Inicializa el contador de reportes

        for (const doc of usuariosSnapshot.docs) {
            const usuario = doc.data();

            // Verifica si el usuario no es administrador antes de agregarlo a la tabla
            if (usuario.rol !== 'Admin') {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidoPaterno}</td>
                    <td>${usuario.apellidoMaterno}</td>
                    <td>${contadorReportes}</td> <!-- Agrega la columna de número de reportes -->
                    
                `;

                tablaUsuarios.appendChild(fila);
                contadorReportes++;  // Incrementa el contador de reportes para el siguiente usuario
            }
        }
    } catch (error) {
        console.error('Error al obtener y mostrar usuarios:', error);
    }
}

const verReportes = document.getElementById("verReportes");
    
// Llamada inicial para mostrar los usuarios
obtenerUsuariosExceptoAdmin();
