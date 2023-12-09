const form = document.querySelector("#form");


form.addEventListener("submit", event => {
  event.preventDefault();


  const fileInput = document.querySelector("#file");
  const file = fileInput.files[0];

  if (file) {
    const blob = new Blob([file], { type: "text/plain" });

    // Crear un enlace de descarga
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = window.URL.createObjectURL(blob);
    enlaceDescarga.download = file.name;
    enlaceDescarga.innerText = file.name;

    // Agregar el enlace al cuerpo del documento
    document.body.appendChild(enlaceDescarga);

    // Eliminar el enlace y revocar la URL del Blob después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(blob);
      enlaceDescarga.remove();
    }, 6000000); // Eliminar después de 5 segundos (puedes ajustar según tus necesidades)
  } else {
    alert("Selecciona un archivo antes de generar el enlace de descarga.");
  }
});
