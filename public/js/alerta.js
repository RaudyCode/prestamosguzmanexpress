function alerta(mensaje) {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(mensaje);
  } else {
      console.log(mensaje);
  }
}


export default alerta