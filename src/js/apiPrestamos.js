(function () {
    const selectPrestamo = document.querySelector("#prestamoAsociado")
    const cuotaDiv = document.querySelector("#cuota")
    const selecionAbonar = document.querySelector("#selecion")
    const abonarDiv = document.querySelector("#abonarDiv")


    // eventListtener
    $(document).ready(function() {
        $('#cliente').select2(); // Inicializar Select2
    
        $('#cliente').on('change', function() {
            let selectedValue = $(this).val(); // Obtener el valor seleccionado
            console.log("Cliente seleccionado:", selectedValue);
            apiPrestamos(selectedValue)
        });
    });

    
    selectPrestamo.addEventListener("change", e =>{
        const opcionSeleccionada = e.target.options[e.target.selectedIndex]; // Obtiene la opción seleccionada
        mostrarCuota(opcionSeleccionada.dataset.cuota); 
    })

    // check
    selecionAbonar.addEventListener("change", ()=>{
        abonarDiv.classList.toggle('hidden')
    })


    // funciones
    const apiPrestamos = async (clienteId) => {
        try {
            const url = `/api/prestamos`;
            const respuesta = await fetch(url);
            const prestamos = await respuesta.json();

            filtrarPrestamos(prestamos, clienteId)
        } catch (error) {
            console.error("Error obteniendo los préstamos:", error);
        }
    };

    function filtrarPrestamos(prestamos, clienteId) {
        const prestamosFiltrados = prestamos.filter(prestamo => prestamo.clienteId == clienteId);
        mostrarPrestamos(prestamosFiltrados); 
        
    }

    const mostrarPrestamos = (prestamos) => {

        limpiarHtml(selectPrestamo)
        limpiarHtml(cuotaDiv)

        const op = document.createElement("option")
        op.textContent="- Seleccione -";
        op.value=""

        selectPrestamo.appendChild(op)

        prestamos.forEach(prestamo => {

            if(prestamo.totalApagar === prestamo.totalPagado){
                return;
            }
            const option = document.createElement("option");
            option.textContent=`${new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.monto)} - ${prestamo.fechaInicio}`
            option.value=prestamo.id
            option.setAttribute('data-cuota', new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.cuota))
            
            selectPrestamo.appendChild(option)
        });
           
    };

    const mostrarCuota= (cuota)=>{
        
        limpiarHtml(cuotaDiv)

        const cuotaP= document.createElement('p');
        cuotaP.classList.add("font-extrabold")
        cuotaP.innerHTML=`Cuota: <span class="font-normal">${cuota}</span>`

        cuotaDiv.appendChild(cuotaP)
    }

    function limpiarHtml(resultado){
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }
    }


})();