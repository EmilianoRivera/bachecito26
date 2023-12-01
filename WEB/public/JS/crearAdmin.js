import { query, doc, db, collection, getDocs, addDoc, onSnapshot, deleteDoc} from "../JS/firebase.js";


const adminForm = document.getElementById("crear-admin");
const name = document.getElementById("nombre")
const appat = document.getElementById("appat")
const apmat = document.getElementById("apmat")
const fechaNacimiento = document.getElementById("fechaNacimiento")
const email = document.getElementById("email")
const password = document.getElementById("contraseña")

const administradoresContainer = document.getElementById('administradores-container');

//crear colección
/*
const crearColeccionAdministradores = async () => {
    try {
        // Intenta obtener la referencia a la colección "administradores"
        const administradoresCollectionRef = collection(db, 'administradores');

        // Asegúrate de que la colección "administradores" no existe antes de crearla
        const snapshot = await getDocs(administradoresCollectionRef);

        if (snapshot.empty) {
            // Crea la colección "administradores"
            await addDoc(administradoresCollectionRef, { dummyData: true });
            console.log('Colección "administradores" creada exitosamente.');
        } else {
            console.log('La colección "administradores" ya existe.');
        }
    } catch (error) {
        console.error('Error al crear la colección "administradores":', error);
    }
};

crearColeccionAdministradores();*/
//obtener datos


adminForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = name.value;
    const apellidoPaterno = appat.value;
    const apellidoMaterno = apmat.value;
    
    const correo = email.value;
    const contraseña = password.value;

    const rol = "Admin";
    try {
        const docRef = await addDoc(collection(db, 'usuarios'), {
            nombre: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            correo: correo,
            contraseña: contraseña,
            rol:rol
        });

        console.log('Administrador registrado con el ID:', docRef.id);

        // Puedes realizar otras acciones después de registrar exitosamente, como redirigir a otra página, mostrar un mensaje, etc.
    } catch (error) {
        console.error('Error al registrar el administrador:', error);
    }
})

//Borrar Administrador
window.borrarAdministrador = async function (id){
    try {
        await deleteDoc(doc(db, 'usuarios', id));
        console.log(`Admin con ID ${id} eliminado exitosamente.`);
    } catch (error) {
        console.error('Error al borrar el admin:', error);
    }
}
//Obtener admin
const obtenerUser = async () => {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    return querySnapshot;
};

const onGetUser = (callback) => {
    const query = collection(db, 'usuarios');

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
        callback(querySnapshot);
    });
    return unsubscribe;
}

//Mostrar Administradores

window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Agregar el estado "no publicado" antes de mostrar los reportes
        const querySnapshot = await obtenerUser();
        querySnapshot.forEach(async (doc) => {
            const usuario = doc.data();

        });

        // Mostrar los reportes
        const unsubscribe = onGetUser((querySnapshot) => {
     
            administradoresContainer.innerHTML = "";
            let i = 0;
            querySnapshot.forEach((doc) => {
                const usuario = doc.data();
                const userId = doc.id;
                administradoresContainer.innerHTML += 
                ` <div class="administrador">
                <p>Nombre: ${usuario.nombre}</p>
                <p>Apellido Paterno: ${usuario.apellidoPaterno}</p>
                <p>Apellido Materno: ${usuario.apellidoMaterno}</p>
                <p>Correo: ${usuario.correo}</p>
                <p>Rol: ${usuario.rol}</p>
                <button onclick=" borrarAdministrador('${userId}') ">Borrar Administrador</button>
                <a href="editarAdmin.html">Actualizar Administrador</a>
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


