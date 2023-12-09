import {db, collection, getDocs, onSnapshot,doc, deleteDoc } from './firebase.js';
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

window.borrarDiv = async function(boton, docId) {
    const divAEliminar = boton.parentNode; // Obtiene el div padre del botón

    try {
        // Eliminar el documento de la base de datos usando su ID
        await deleteDoc(doc(db, 'reportes', docId));

        // Eliminar el div del DOM
        divAEliminar.remove();
    } catch (error) {
        console.error('Error al borrar el documento:', error);
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
              
                reportesContenedorAdmin.innerHTML += `
                <div class="publicacion" id="box1" 
                style="width: 100%;
                padding: 2vw;
                height: auto;
                background-color: #F1F1F1;
                border-radius: 6vh;
                margin-bottom: 5%;
                margin-right: 5%;
                box-shadow: 1rem 1rem 1rem 0 rgba(0, 0, 0, 0.082);
                display: flex; 
                box-sizing: border-box;
                ">

                    <h3 style="color: #ffb866; margin-right:2vw; font-size:2em; color:#6F6F6F;">${i += 1}</h3>
                    <div class="foto">
                        <img src="${reporte.imagenURL}"
                        style="width: 18vw;
                        height: auto;
                        background-color: #bbbbbb;  
                        border-radius: 1.5vw; " width="40%" height="20%"></img >
                    </div>
                    <div class="info" style="width: 40%; padding-right:2vw;padding-left:2vw;">
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Ubicación</h3>
                        <p style="color: #525252; margin-left:2vw; text-align: justify; font-size:1em">${reporte.ubicacion}</p>
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Descripción</h3>
                        <p style="color: #525252; margin-left:2vw; text-align: justify;">${reporte.descripcion}</p>
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Nombre: </h3>
                        <p style="color: #525252; margin-left:2vw; text-align: justify;">${reporte.nombre + " " + reporte.apellidoPaterno + " " + reporte.apellidoMaterno}</p>
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Fecha Nacimiento: </h3>
                        <p style="color: #525252; margin-left:2vw; text-align: justify;">${reporte.fechaNacimiento}</p>
                        
                    </div>
                    <button style="color: #525252; 
                            text-align: justify; 
                            padding-left: 2%;
                            padding-right: 2%;
                            padding-top:.5vw;
                            padding-bottom:.5vw;
                            border-radius: 6vh;
                            font-size: 1.2rem;
                            height:5%;
                            width:20%;
                            text-align:justify;
                            display:flex;
                            border:none;
                            background-color:#fff;" 
                            onclick="borrarDiv(this, '${doc.id}')">Borrar</button>
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