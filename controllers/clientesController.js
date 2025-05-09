import {check, validationResult} from "express-validator"
import {Rutas, Clientes, Prestamo, Pagos} from "../modules/index.js";
import toastr from "toastr";
import { Op } from 'sequelize';


const generarIdCliente = async (rutaId) => {
    
    try {

        // Obtener el máximo ID actual para la ruta especificada
        const maxIdCliente = parseInt(await Clientes.max('idCliente', { where: { rutaId } }));


        // Si no hay clientes en la ruta, el primer ID será 1; de lo contrario, incrementa el máximo en 1
        const nuevoId = maxIdCliente ? maxIdCliente + 1 : 1;

        return nuevoId

    } catch (error) {
        console.log(error)
    }

}   

const gestionCliente = async (req, res) => {
    try {
        const { id: rutaId } = req.params;
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        // Construir la consulta base
        const baseQuery = {
            where: { rutaId },
            order: [['idCliente', 'ASC']]
        };

        // Obtener el total de clientes
        const totalClientes = await Clientes.count(baseQuery);

        // Añadir paginación a la consulta base
        const queryFinal = {
            ...baseQuery,
            limit: limite,
            offset: offset
        };

        // Obtener los clientes paginados
        const clientes = await Clientes.findAll(queryFinal);

        const ruta = await Rutas.findByPk(rutaId);
        
        if(!ruta){
            return res.redirect('/rutas');
        }

        const totalPaginas = Math.ceil(totalClientes / limite);

        res.render('clientes/gestion-cliente', {
            pagina: "Gestión de Clientes",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            clientes: clientes ? clientes : [],
            ruta: ruta,
            id: req.params.id,
            paginacion: {
                pagina,
                totalPaginas,
                totalClientes,
                limite
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al cargar clientes' });
    }
}

const guardarCliente = async (req, res) => {
    let resultado = validationResult(req);
    const { id: rutaId } = req.params;

    const clientes = await Clientes.findAll({
        where: {
            rutaId: rutaId
        }
    });

    const ruta = await Rutas.findByPk(rutaId)

    // validar que la ruta exte
        
    if(!ruta){
        return res.redirect('/rutas')
    }

    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('clientes/gestion-cliente', {
            pagina:"Gestión de Clientes",
            clientes: clientes ? clientes : [],
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            ruta:ruta.nombre,
            id:req.params.id
    
        })
    }

    

    try {

        const { nombre, cedula, telefono, email, direccion } = req.body;
        const { id: rutaId } = req.params;
        const rutaIdInt = parseInt(rutaId);
        const nuevoId = await generarIdCliente(rutaId)
        const clienteGuardado = await Clientes.create({
            idCliente: nuevoId,
            nombre,
            cedula,
            telefono,
            email,
            direccion,
            rutaId:rutaIdInt
        });

        res.redirect(`/clientes/${rutaId}`);
    } catch (error) {
        console.log(error)
    }


}

const editar = async (req, res) => {
    

    const {id}=req.params;

    // validar que la ruta exista
    const cliente = await Clientes.findByPk(id);

    if (!cliente) {
        return res.redirect('/clientes');
    }

    const ruta = await Rutas.findByPk(cliente.rutaId)
    
    res.render('clientes/editar', {
        pagina: `Editar Cliente ${cliente.nombre}`,
        usuarioName: req.usuario.nombre,
        csrfToken: req.csrfToken(),
        datos:cliente,
        ruta

        
    })
}

const guardarCambios = async (req, res) => {
    // Verificar la validación
    const resultado = validationResult(req);

    

    const { id } = req.params;

    // Validar que el cliente exista
    const cliente = await Clientes.findByPk(id);

    if (!cliente) {
        return res.redirect('/clientes');
    }

    const ruta = await Rutas.findByPk(cliente.rutaId)
    console.log(ruta)

    if (!resultado.isEmpty()) {
        return res.render('clientes/editar', {
            pagina: `Editar Cliente ${req.body.nombre}`,
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body,
            ruta
            
        });
    }
    // Reescribir el objeto y actualizarlo
    try {
        const { nombre, cedula, telefono, email, direccion } = req.body;

        cliente.set({
            nombre,
            cedula,
            telefono,
            email,
            direccion
        });

        await cliente.save();
    } catch (error) {
        console.log(error);
    }
};

const mostrarCliente = async (req, res)=>{
    try {
        const { idruta: rutaId, id:clienteId } = req.params;
   
        const prestamos = await Prestamo.findAll({
            where: {
                clienteId: clienteId
            },
            include: [
                { model: Pagos, as: 'pagos' }
            ]
        });


        const cliente = await Clientes.findOne({
            where: {
                id: clienteId,
                rutaId: rutaId
            }
        });
        const ruta = await Rutas.findByPk(rutaId)

        // validar que la ruta exte
        
        if(!ruta){
            return res.redirect('/rutas')
        }

        // validar que el prestamo exista
        if(!cliente){
            return res.redirect(`/clientes/${rutaId}`)
        }




        res.render('clientes/mostrar', {
            pagina:`Perfil del Cliente`,
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            cliente:cliente,
            prestamos: prestamos,
            ruta:ruta,
            id:req.params.id
    
        })

    } catch (error) {
        console.log(error)
    }

}

const buscarClientes = async (req, res) => {
    try {
        const { id: rutaId } = req.params;
        const { termino } = req.query;
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        // Construir la consulta base
        const baseQuery = {
            where: { rutaId },
            order: [['idCliente', 'ASC']]
        };

        // Si hay término de búsqueda, añadir condiciones
        if (termino) {
            baseQuery.where = {
                ...baseQuery.where,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${termino}%` } },
                    { cedula: { [Op.like]: `%${termino}%` } },
                    { idCliente: { [Op.like]: `%${termino}%` } },
                    { id: { [Op.like]: `%${termino}%` } }
                ]
            };
        }

        // Obtener el total de clientes
        const totalClientes = await Clientes.count(baseQuery);

        // Si no hay resultados, devolver respuesta vacía
        if (totalClientes === 0) {
            return res.json({
                clientes: [],
                paginacion: {
                    pagina: 1,
                    totalPaginas: 0,
                    totalClientes: 0,
                    limite
                }
            });
        }

        // Añadir paginación a la consulta base
        const queryFinal = {
            ...baseQuery,
            limit: limite,
            offset: offset
        };

        // Obtener los clientes paginados
        const clientesPaginados = await Clientes.findAll(queryFinal);

        // Calcular total de páginas
        const totalPaginas = Math.ceil(totalClientes / limite);

        // Devolver resultados
        res.json({
            clientes: clientesPaginados,
            paginacion: {
                pagina,
                totalPaginas,
                totalClientes,
                limite
            }
        });

    } catch (error) {
        console.log('Error en la búsqueda:', error);
        res.status(500).json({ 
            error: 'Error al buscar clientes',
            detalles: error.message 
        });
    }
};

export{
    gestionCliente,
    guardarCliente,
    editar,
    guardarCambios,
    mostrarCliente,
    buscarClientes
}