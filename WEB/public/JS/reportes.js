import {db, collection, getDocs, onSnapshot,doc, updateDoc } from './firebase.js';

const reportesContenedorUsuario = document.getElementById("reportes-container"); // este solo es para crear el contenedor del reporte en index.html
//const reportesContenedorAdmin = document.getElementById("reportes-container-admin") // este solo es para crear el contenedor del reporte en reportes.html


const obtenerReportes = async () => {
    const querySnapshot = await getDocs(collection(db, 'reportes'));
    return querySnapshot;
};

const onGetReportes = (callback) => {
    const query = collection(db, 'reportes');

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
        callback(querySnapshot);
    });

    // Devolvemos la función para desuscribirse cuando sea necesario
    return unsubscribe;
}

const actualizarEstadoReporte = async (id, nuevoEstado) => {
    const reporteRef = doc(db, 'reportes', id);

    try {
        await updateDoc(reporteRef, { estado: nuevoEstado });
        console.log("Estado actualizado para el reporte:", id, "Nuevo estado:", nuevoEstado);
    } catch (error) {
        console.error("Error al actualizar estado para el reporte:", id, "Error:", error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Agregar el estado "no publicado" antes de mostrar los reportes
        const querySnapshot = await obtenerReportes();
        querySnapshot.forEach(async (doc) => {
            const reporte = doc.data();
            await actualizarEstadoReporte(doc.id, "No publicado");

        });

        // Mostrar los reportes
        const unsubscribe = onGetReportes((querySnapshot) => {
            reportesContenedorUsuario.innerHTML = "";
           // reportesContenedorAdmin.innerHTML = "";
            let i = 0;
            querySnapshot.forEach((doc) => {
                const reporte = doc.data();
                reportesContenedorUsuario.innerHTML += `
                <div class="publicacion" id="box1" 
                style="width: 45%;
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
                    <div class="info" 
                    width: 50%;
                    ">
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Ubicación</h3>
                        <p style="color: #525252; text-align: justify; font-size:1em">${reporte.ubicacion}</p>
                        <h3 style="color: #ffb866; margin-left:2vw; font-size:1.7em; margin-bottom:5px;">Descripción</h3>
                        <p style="color: #525252; text-align: justify;">${reporte.descripcion}</p>
                    </div>
                    
                </div>`;


            });
            querySnapshot.forEach(async (doc) => {
                await actualizarEstadoReporte(doc.id, "Publicado");
            });
        });

        // Puedes usar `unsubscribe` para dejar de escuchar los cambios en algún momento
        // Por ejemplo, si dejas la página o dejas de necesitar las actualizaciones en tiempo real
        // unsubscribe();
    } catch (error) {
        console.error('Error al obtener reportes:', error);
    }
})


//Front para la animación de las letras
const mouse = newV2();
const center = newV2();
const distanceFromCenter = newV2();
const distanceLerped = newV2();
let simulateMouseMovement = true;

const perspective = 500;
const translateZ = -22;
const rotate = 1;
const skew = 3;

const container = document.getElementById("container");
const copies = document.getElementsByClassName("copy");

function updateCenter() {
const rect = container.getBoundingClientRect();
center.x = rect.left + rect.width / 2;
center.y = rect.top + rect.height / 2;
}

function trackMousePosition(event) {
simulateMouseMovement = false;
mouse.x = event.clientX;
mouse.y = event.clientY;
distanceFromCenter.x = center.x - mouse.x;
distanceFromCenter.y = center.y - mouse.y;
}

function fakeMousePosition(t) {
distanceFromCenter.x = Math.sin(t / 500) * window.innerWidth * 0.5;
distanceFromCenter.y = Math.cos(t / 500) * window.innerWidth * 0.2;
}

function updateTextPosition(t) {
if (simulateMouseMovement) fakeMousePosition(t);

lerpV2(distanceLerped, distanceFromCenter);

for (var i = 1; i < copies.length + 1; i++) {
const copy = copies[i - 1];
copy.style.transform = makeTransformString(
i * distanceLerped.y * 0.05,
i * translateZ,
i * rotate * (distanceLerped.x * 0.003),
i * skew * (distanceLerped.x * 0.003)
);
}

requestAnimationFrame(updateTextPosition);
}

function makeTransformString(y, z, rotate, skew) {
return `perspective(${perspective}px) translate3d(0px, ${y}px, ${z}px) rotate(${rotate}deg) skew(${skew}deg)`;
}

function lerpV2(position, targetPosition) {
position.x += (targetPosition.x - position.x) * 0.2;
position.y += (targetPosition.y - position.y) * 0.2;
}

function newV2(x = 0, y = 0) {
return {
x: x,
y: y
};
}

updateCenter();
document.addEventListener("mousemove", trackMousePosition);
window.addEventListener("resize", updateCenter);
requestAnimationFrame(updateTextPosition);