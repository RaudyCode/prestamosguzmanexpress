import prestamos from './prestamos.js';
import clientes from './clientes.js';
import rutas from './rutas.js';
import usuarios from './usuarios.js';
import {exit} from 'node:process';
import db from "../config/db.js";
import {Prestamo, Clientes, Pagos, Rutas, Usuario} from '../modules/index.js'


const inmportarDatos = async ()=>{
    try {
        //Autenticar
        await db.authenticate() 

        // Drop and recreate all tables
        await db.sync({ force: true })

        // First import users
        await Usuario.bulkCreate(usuarios);

        // Then import routes
        await Rutas.bulkCreate(rutas);

        // Then import clients
        await Clientes.bulkCreate(clientes);

        // Finally import loans
        await Prestamo.bulkCreate(prestamos);

        console.log('Datos Importados Correctamente')
        exit()

    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        // Drop and recreate all tables
        await db.sync({ force: true });
        
        console.log('Datos eliminados correctamente');
        exit();
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i"){
    inmportarDatos();
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}