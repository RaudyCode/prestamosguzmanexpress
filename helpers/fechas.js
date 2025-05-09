const formatearFecha = (fecha) => {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-11
    const día = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${día}`;
};

export {
    formatearFecha
}