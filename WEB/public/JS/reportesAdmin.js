import {db, collection, getDocs, onSnapshot,deleteDoc , doc} from './firebase.js';
const reportesContenedorAdmin = document.getElementById("reportes-container-admin") 


const obtenerReportes = async () => {
    const querySnapshot = await getDocs(collection(db, 'reportes'));
    return querySnapshot;
};

const onGetReportes = (callback) => {
    const query = collection(db, 'reportes');

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
        callback(querySnapshot);
    });
    return unsubscribe;
}

window.borrarReporte = async function(id) {
    try {
        await deleteDoc(doc(db, 'reportes', id));
        console.log(`Reporte con ID ${id} eliminado exitosamente.`);
    } catch (error) {
        console.error('Error al borrar el reporte:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Agregar el estado "no publicado" antes de mostrar los reportes
        const querySnapshot = await obtenerReportes();
        querySnapshot.forEach(async (doc) => {
            const reporte = doc.data();

        });

        // Mostrar los reportes
        const unsubscribe = onGetReportes((querySnapshot) => {
     
           reportesContenedorAdmin.innerHTML = "";
            let i = 0;
            querySnapshot.forEach((doc) => {
                const reporte = doc.data();
                const reporteId = doc.id;
                reportesContenedorAdmin.innerHTML += `
                    <div class="publicacion"> 
                    <h1>${i += 1}</h1>
                    <img src="${reporte.imagenURL}" ></img >
                    <p>${reporte.ubicacion}</p>
                    <p>${reporte.descripcion}</p>
                    <button onclick=" borrarReporte('${reporteId}') ">Borrar</button>

                    </div>`;

            });

        });

        // Puedes usar `unsubscribe` para dejar de escuchar los cambios en algún momento
        // Por ejemplo, si dejas la página o dejas de necesitar las actualizaciones en tiempo real
        // unsubscribe();
    } catch (error) {
        console.error('Error al obtener reportes:', error);
    }
})