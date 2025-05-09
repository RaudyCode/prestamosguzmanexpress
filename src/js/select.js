document.addEventListener("DOMContentLoaded", () => {
    const inputvalue = document.querySelector("#inputvalue");
    const inputAgregar = document.querySelector("#agregar");
    const radios = document.querySelectorAll('input[name="monto"]');
    const botonPagar = document.getElementById("btnPagar");
    const dvContenedor = document.querySelector('#insertar');
    const montoTotal = document.querySelector('#montoTotal')

    // Deshabilita el botón al inicio
    botonPagar.disabled = true;
    botonPagar.classList.add("cursor-not-allowed", "opacity-50");
    botonPagar.classList.remove("hover:bg-green-700", "cursor-pointer");

    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            // Verifica si el radio seleccionado es "Abono a capital"
            if (this.id === "agregar") {
                inputvalue.disabled = false; // Habilita el input
            } else {
                inputvalue.disabled = true; // Lo deshabilita
                inputvalue.value = "0.00"; // Restablece el valor
            }

            // Habilita el botón solo si algún radio está seleccionado
            const algunaSeleccion = [...radios].some(r => r.checked);
            if (algunaSeleccion) {
                botonPagar.disabled = false;
                botonPagar.classList.remove("cursor-not-allowed", "opacity-50");
                botonPagar.classList.add("hover:bg-green-700", "cursor-pointer");
            } else {
                botonPagar.disabled = true;
                botonPagar.classList.add("cursor-not-allowed", "opacity-50");
                botonPagar.classList.remove("hover:bg-green-700", "cursor-pointer");
            }
        });
    });

    // Cambia el valor de "Abono a capital" cuando el usuario escribe
    inputvalue.addEventListener("input", (e) => {
        inputAgregar.value =[e.target.value, "abono"];
    });


    if(montoTotal.value=="0,saldoTotal"){
        dvContenedor.innerHTML= `<div class="bg-white shadow py-8 px-4 rounded-lg max-w-md mx-auto">

                                    <p class="bg-green-500 py-2 px-5 rounded-lg w-full font-bold text-center text-white uppercase">Prestamo Totalmente Pagado</p>
                                    
                                    
                                </div>`
    }
});
