import { check, validationResult } from "express-validator";
import Rutas from "../modules/Ruta.js";
import Prestamo from "../modules/Prestamo.js";
import Pagos from "../modules/Pago.js";
import Clientes from "../modules/Cliente.js";
import { Op } from "sequelize";

const crear = async (req, res) => {

    try {

        const rutas = await Rutas.findAll();
   
        return res.render('rutas/vista-rutas', {
            pagina: "Rutas",
            rutas:rutas,
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            id:req.params.id
           
    
        })

        
    } catch (error) {
        console.log(error)
        return res.render('rutas/vista-rutas', {
            pagina: "Rutas",
            rutas:[],
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            id:req.params.id
        })
    }


}
const guardar = async (req, res) => {
    let resultado = validationResult(req);
    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('rutas/vista-rutas', {
            pagina: "Rutas",
            rutas: [],
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            id:req.params.id
    
        })
    }

    // crear un registro
    const {nombre,  capital, diaCobro} = req.body

    

    const {id: usuarioId} = req.usuario;

    try {
        const RutaGuardada = await Rutas.create({
            nombre, 
            capital,
            diaCobro,
            usuarioId
        })

        res.redirect(`/rutas`)
    } catch (error) {
        console.log(error)
    }


}


const admin = async (req, res) => {
    const { id } = req.params;

    // Validar que la ruta exista
    const ruta = await Rutas.findByPk(id);
    if (!ruta) {
        return res.redirect('/rutas');
    }

    try {
        // Total generado por préstamos
        const totalGenerado = await Prestamo.sum('totalApagar');

        // Pagos recibidos en las últimas 4 semanas
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - 28); // Últimas 4 semanas
        const pagosUltimasSemanas = await Pagos.findAll({
            where: {
                fecha: {
                    [Op.gte]: fechaInicio
                }
            },
            attributes: ['fecha', 'monto']
        });

        // Estado de los préstamos
        const prestamosEstado = await Prestamo.findAll({
            attributes: ['estado', [Prestamo.sequelize.fn('COUNT', Prestamo.sequelize.col('estado')), 'cantidad']],
            group: ['estado']
        });

        // Estado de los clientes
        const clientesEstado = await Clientes.findAll({
            attributes: ['estado', [Clientes.sequelize.fn('COUNT', Clientes.sequelize.col('estado')), 'cantidad']],
            group: ['estado']
        });

        // Tendencias de atrasos
        const tendenciasAtrasos = await Prestamo.findAll({
            attributes: ['semanasAtrasadas', [Prestamo.sequelize.fn('COUNT', Prestamo.sequelize.col('semanasAtrasadas')), 'cantidad']],
            group: ['semanasAtrasadas']
        });

        // Renderizar la vista con las métricas
        res.render('rutas/admin', {
            pagina: "Panel de Administración",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            id: req.params.id,
            totalGenerado,
            pagosUltimasSemanas,
            prestamosEstado,
            clientesEstado,
            tendenciasAtrasos,
            ruta
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('rutas/admin', {
            pagina: "Panel de Administración",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            id: req.params.id,
            error: 'Error al obtener las métricas'
        });
    }
};


const editar = async (req, res) => {
    

    const {id}=req.params;

    // validar que la ruta exista
    const ruta= await Rutas.findByPk(id);

    if(!ruta){
        return res.redirect('/rutas');
    }

    
    
    res.render('rutas/editar', {
        pagina: `Editar Ruta ${ruta.nombre}`,
        usuarioName: req.usuario.nombre,
        csrfToken: req.csrfToken(),
        datos:ruta

        
    })
}

const guardarCambios = async (req, res)=>{

    //verificar la validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        return res.render('rutas/editar', {
            pagina: `Editar Ruta ${ruta.nombre}`,
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            datos: req.body
    
            
        })
    }

    const {id}=req.params;

    // validar que la ruta exista
    const ruta= await Rutas.findByPk(id);

    if(!ruta){
        return res.redirect('/rutas');
    }
    
    
    // reescribir el objeto y actualizarlo
    try {

        // reescribir el objeto y actualizarlo
        const {nombre,  capital, diaCobro} = req.body

   
        ruta.set({
            nombre, 
            capital,
            diaCobro
        })

        await ruta.save();

        res.redirect(`/rutas`)
    } catch (error) {
        console.log(error)
    }
}

const eliminar = async (req, res)=>{
    const {id}=req.params;

    // validar que la ruta exista
    const ruta = await Rutas.findByPk(id, {
        include:[
            {model:Clientes, as: 'clientes'}
        ]
    });


    if(!ruta){
        return res.redirect('/rutas');
    }
    
    if(ruta.clientes.length === 0){
        // eliminar la ruta

        await ruta.destroy()
        
        return res.redirect('/rutas');
    }
    
    
    return res.redirect(`/alerta/${id}`)
    
    
}


const alerta = async (req, res) => {
    const {id}=req.params;

    // validar que la ruta exista
    const ruta = await Rutas.findByPk(id, {
        include:[
            {model:Clientes, as: 'clientes'}
        ]
    });

    return res.render('rutas/alerta', {
        pagina: "Error al Eliminar ruta",
        mensaje: `No puedes eliminar la ruta ${ruta.nombre}, tienes un total de ${ruta.clientes.length} Clientes en esta ruta. Para eliminarla debes borrar todos los clientes.`,
        error: true


    })
}




export {
   crear,
   guardar,
   admin,
   editar,
   guardarCambios,
   eliminar,
   alerta
}