const clientes = [
    // Clientes de la Ruta 1 (IDs 1-35)
    { idCliente:1, nombre: "Raudy García", cedula: "402156", telefono: "8296719", email: "raudyc@example.com", direccion: "Tocoa", estado: "activo", rutaId: 1 },
    { idCliente:2, nombre: "Edith Perez", cedula: "402397", telefono: "8296719", email: "edith@example.com", direccion: "Tocoa", estado: "activo", rutaId: 1 },
    { idCliente:3, nombre: "Jose Manuel", cedula: "560758", telefono: "8296719", email: "jose@example.com", direccion: "Tocoa", estado: "activo", rutaId: 1 },
    { idCliente:4, nombre: "Braiquel D.", cedula: "566765", telefono: "8296719", email: "braiquel@example.com", direccion: "Tocoa", estado: "activo", rutaId: 1 },
    { idCliente:5, nombre: "Ana López", cedula: "402198", telefono: "8296719", email: "ana@example.com", direccion: "Tocoa", estado: "activo", rutaId: 1 },
    
    // Additional clients for Route 1 (16-35)
    ...Array.from({length: 20}, (_, i) => ({
        idCliente: i + 16,
        nombre: `Cliente ${i + 16}`,
        cedula: `4021${i + 16}`,
        telefono: "8296719",
        email: `cliente${i + 16}@example.com`,
        direccion: "Tocoa",
        estado: "activo",
        rutaId: 1
    })),
  
    // Clientes de la Ruta 2 (IDs 6-10, 36-50)
    { idCliente:6, nombre: "Juan Herrera", cedula: "402899", telefono: "8296719", email: "juan@example.com", direccion: "San Pedro", estado: "activo", rutaId: 2 },
    { idCliente:7, nombre: "María Gómez", cedula: "402654", telefono: "8296719", email: "maria@example.com", direccion: "San Pedro", estado: "activo", rutaId: 2 },
    { idCliente:8, nombre: "Carlos Díaz", cedula: "402777", telefono: "8296719", email: "carlos@example.com", direccion: "San Pedro", estado: "activo", rutaId: 2 },
    { idCliente:9, nombre: "Luis Mendoza", cedula: "402555", telefono: "8296719", email: "luis@example.com", direccion: "San Pedro", estado: "activo", rutaId: 2 },
    { idCliente:10, nombre: "Carmen Ortiz", cedula: "402321", telefono: "8296719", email: "carmen@example.com", direccion: "San Pedro", estado: "activo", rutaId: 2 },
    
    // Additional clients for Route 2 (36-50)
    ...Array.from({length: 15}, (_, i) => ({
        idCliente: i + 36,
        nombre: `Cliente ${i + 36}`,
        cedula: `4022${i + 36}`,
        telefono: "8296719",
        email: `cliente${i + 36}@example.com`,
        direccion: "San Pedro",
        estado: "activo",
        rutaId: 2
    })),
  
    // Clientes de la Ruta 3 (IDs 11-15, 51-67)
    { idCliente:11, nombre: "Pedro Sánchez", cedula: "403111", telefono: "8296719", email: "pedro@example.com", direccion: "La Ceiba", estado: "activo", rutaId: 3 },
    { idCliente:12, nombre: "Sofía Ramírez", cedula: "403222", telefono: "8296719", email: "sofia@example.com", direccion: "La Ceiba", estado: "activo", rutaId: 3 },
    { idCliente:13, nombre: "Roberto Chávez", cedula: "403333", telefono: "8296719", email: "roberto@example.com", direccion: "La Ceiba", estado: "activo", rutaId: 3 },
    { idCliente:14, nombre: "Andrea Morales", cedula: "403444", telefono: "8296719", email: "andrea@example.com", direccion: "La Ceiba", estado: "activo", rutaId: 3 },
    { idCliente:15, nombre: "Fernando Torres", cedula: "403555", telefono: "8296719", email: "fernando@example.com", direccion: "La Ceiba", estado: "activo", rutaId: 3 },
    
    // Additional clients for Route 3 (51-67)
    ...Array.from({length: 17}, (_, i) => ({
        idCliente: i + 51,
        nombre: `Cliente ${i + 51}`,
        cedula: `4023${i + 51}`,
        telefono: "8296719",
        email: `cliente${i + 51}@example.com`,
        direccion: "La Ceiba",
        estado: "activo",
        rutaId: 3
    }))
].flat();

export default clientes
  