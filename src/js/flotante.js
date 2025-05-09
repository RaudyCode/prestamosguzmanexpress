import toastr from "toastr";
const btn = document.querySelector("#btn")
const rutaId = btn.dataset.rutaid; 


btn.addEventListener('click', ()=>{
    alertaCorrecta('El cliente ha sido actualizado con éxito.', 'Éxito');

    setTimeout(() => {
        window.location.href = `/clientes/${rutaId}`;
    }, 3000);
})


const alertaCorrecta = (mensaje, titulo) => {
    toastr.success(mensaje, titulo)
}


export{
    alertaCorrecta,
}