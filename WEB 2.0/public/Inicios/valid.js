function validarN(e) {
    var teclado = (document.all) ? e.keyCode : e.which;
    if(teclado == 8) return true;
    var patron = /[A-Z a-z]/;
    var tecla_final = String.fromCharCode(teclado);
    return patron.test(tecla_final);
}

function validarA(e) {
    var teclado = (document.all) ? e.keyCode : e.which;
    if(teclado == 8) return true;
    var patron = /[A-Za-z]/;
    var tecla_final = String.fromCharCode(teclado);
    return patron.test(tecla_final);
}

function validarC(e) {
    var teclado = (document.all) ? e.keyCode : e.which;
    if(teclado == 8) return true;
    var patron = /[A-Za-z0-9_@.-]/;
    var tecla_final = String.fromCharCode(teclado);
    return patron.test(tecla_final);
}

function validarCon(e) {
    var teclado = (document.all) ? e.keyCode : e.which;
    if(teclado == 8) return true;
    var patron = /[A-Za-z0-9-_]/;
    var tecla_final = String.fromCharCode(teclado);
    return patron.test(tecla_final);
}

function calcularEdad(fechaNacimiento) {
    var hoy = new Date();
    var fechaNac = new Date(fechaNacimiento);
    
    var edad = hoy.getFullYear() - fechaNac.getFullYear();
    var mes = hoy.getMonth() - fechaNac.getMonth();
    var dia = hoy.getDate() - fechaNac.getDate();

    // Ajuste para manejar el caso en que aún no ha cumplido años en este año
    if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
    }

    return edad;
}

function validarRegistro(loginForm) {
    // Nombre
    if(loginForm.nombre.value.length < 1){
        alert("Por ingresa un nombre válido");
        loginForm.nombre.focus();
        return false;
    } else {
        if(loginForm.nombre.value.length >= 50){
            alert("Por ingresa un nombre más corto");
            loginForm.nombre.focus();
            return false;
        }
    }

    // Appat
    if(loginForm.appat.value.length < 3){
        alert("Por ingresa un apellido paterno válido de más de 3 caracteres");
        loginForm.appat.focus();
        return false;
    } else {
        if(loginForm.appat.value.length >= 20){
            alert("Por ingresa un apellido paterno más corto");
            loginForm.appat.focus();
            return false;
        }
    }

    // Apmat
    if(loginForm.apmat.value.length < 3){
        alert("Por ingresa un apellido materno válido de más de 3 caracteres");
        loginForm.apmat.focus();
        return false;
    } else {
        if(loginForm.apmat.value.length >= 20){
            alert("Por ingresa un apellido materno más corto");
            loginForm.apmat.focus();
            return false;
        }
    }

    // Correo
    if(loginForm.username.value.length < 10){
        alert("Por favor coloque un correo válido");
        loginForm.username.focus();
        return false;
    } else {
        if(loginForm.username.value.length >= 100){
            alert("Por favor coloque un correo menor a 100 caracteres");
            loginForm.username.focus();
            return false;
        }
    }

    // Contraseña
    if(loginForm.password.value.length < 5){
        alert("Por favor coloque una contraseña con más de 5 caracteres");
        loginForm.password.focus();
        return false;
    } else {
        if(loginForm.password.value.length >= 20){
            alert("Por favor coloque una contraseña con menos de 16 caracteres");
            loginForm.password.focus();
            return false;
        }
    }

    // Fecha de nacimiento
    var fechaNacimiento = loginForm.nacimiento.value;
    if (!fechaNacimiento) {
        alert("Por favor, ingrese la fecha de nacimiento");
        loginForm.nacimiento.focus();
        return false;
    }

    var edad = calcularEdad(fechaNacimiento);
    if (edad < 18 || edad > 60) {
        alert("Debe tener entre 18 y 60 años para registrarse. Actualmente tiene " + edad + " años.");
        loginForm.nacimiento.focus();
        return false;
    }

    return true;
}