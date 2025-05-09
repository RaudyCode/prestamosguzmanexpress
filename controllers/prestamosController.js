import {check, validationResult} from "express-validator"
import {Rutas, Clientes, Prestamo, Pagos, Configuracion} from "../modules/index.js";
import { formatearFecha } from "../helpers/fechas.js";
import { Op } from "sequelize";
import moment from "moment";



const formularioCrear = async (req, res) => {
    
    try {
        const { id: rutaId } = req.params;
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;
   
        const clientes = await Clientes.findAll({
            where: {
                rutaId: rutaId
            }
        });

        // Obtener el total de préstamos para la paginación
        const totalPrestamos = await Prestamo.count({
            where: {
                rutaId: rutaId
            }
        });

        const prestamos = await Prestamo.findAll({
            where: {
                rutaId: rutaId
            },
            include: [
                {model: Clientes, as: 'cliente'},
                {model: Pagos, as: 'pagos'}
            ],
            limit: limite,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        const ruta = await Rutas.findByPk(rutaId)

        // validar que la ruta exte
        
        if(!ruta){
            return res.redirect('/rutas')
        }
        
        // obtener el total de prestamos activos
        const TotalPrestamosActivos = await Prestamo.findAll({
            where: {
                rutaId: rutaId,
                estado:"activo"
            },
            
        });
        
        // obtener el monto total 
        const totalMonto = await Prestamo.sum('monto', {
            where: { rutaId }
        });

        // total atrasos
        const totalAtrasos = await Prestamo.findAll({
            where: {
                rutaId: rutaId,
                estado:"moroso"
            },
            
        });

        // total pagados
        const totalPagados = await Prestamo.findAll({
            where: {
                rutaId: rutaId,
                estado:"pagado"
            },
            
        });

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalPrestamos / limite);
        
        // Mapeo de los días de la semana
        const diasSemana = {
            "Lunes": 1,
            "Martes": 2,
            "Miércoles": 3,
            "Jueves": 4,
            "Viernes": 5,
            "Sábado": 6,
            "Domingo": 7
        };
        
        // Determinar el día de cobro de la ruta
        const diaCobro = diasSemana[ruta.diaCobro] || 1; // Por defecto, lunes
        
        // Fecha actual
        const hoy = moment();
        
        // Obtener el inicio y fin de la semana anterior a la última fecha de cobro
        let ultimoCobro = hoy.clone().isoWeekday(diaCobro);
        
        // Si hoy es antes del día de cobro, tomamos la semana pasada
        if (hoy.isoWeekday() < diaCobro) {
            ultimoCobro = ultimoCobro.subtract(7, "days");
        }
        
        const inicioSemana = ultimoCobro.clone().subtract(6, "days");
        const finSemana = ultimoCobro.clone();
        
        // Buscar pagos atrasados dentro de la semana pasada de la ruta
        const totalAtrasadosSemana = await Prestamo.count({
            where: {
                fechaDeUltimoPago: { [Op.between]: [inicioSemana.format("YYYY-MM-DD"), finSemana.format("YYYY-MM-DD")] },
                estado: "moroso"
            }
        });
        
        // Buscar pagos pagados dentro de la semana pasada de la ruta
        const totalPagadosSemana = await Prestamo.count({
            where: {
                fechaDeUltimoPago: { [Op.between]: [inicioSemana.format("YYYY-MM-DD"), finSemana.format("YYYY-MM-DD")] },
                estado: "pagado"
            }
        });

        res.render('prestamos/crear', {
            pagina:"Gestión de Préstamos ",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            clientes: clientes ? clientes : [],
            prestamos: prestamos ? prestamos : [],
            ruta:ruta,
            id:req.params.id,
            TotalPrestamosActivos,
            totalMonto,
            totalAtrasos,
            totalPagados,
            totalAtrasadosSemana,
            totalPagadosSemana,
            paginacion: {
                pagina,
                totalPaginas,
                totalPrestamos,
                limite
            }
        })

    } catch (error) {
        console.log(error)
    }
}

const guardarPrestamo = async (req, res) => {
    let resultado = validationResult(req);
    const { id: rutaId } = req.params;

    const clientes = await Clientes.findAll({
        where: {
            rutaId: rutaId
        }
    });
    const prestamos = await Prestamo.findAll({
        where: {
            rutaId: rutaId
        },
        
    });

    const ruta = await Rutas.findByPk(rutaId)

    // validar que la ruta exte
        
    if(!ruta){
        return res.redirect('/rutas')
    }



    //
    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('prestamos/crear', {
            pagina:"Gestión de Préstamos",
            clientes: clientes ? clientes : [],
            prestamos: prestamos ? prestamos : [],
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            ruta: ruta,
            id:req.params.id,
            TotalPrestamosActivos
    
        })
    }


    try {
        const { cliente, monto } = req.body; // Recibimos el día de la ruta como número (1 = Lunes, 2 = Martes, ..., 7 = Domingo)
        let diaCobro;

        switch (ruta.diaCobro) {
            case "Martes":
                diaCobro=2

                break;
            case "Miércoles":
                diaCobro=3

                break;
            case "Jueves":
                diaCobro=4

                break;
            case "Viernes":
                diaCobro=5

                break;
            case "Sábado":
                diaCobro=6

                break;
            case "Domingo":
                diaCobro=7

                break;
        
            default:
                diaCobro=1;
                break;
        }
        // Calcular la fecha de inicio según el día de la ruta
        const fechaActual = new Date();
        const diaActual = fechaActual.getDay(); // 0 (Domingo) - 6 (Sábado)

        // Si el día de la ruta ya pasó en esta semana, lo movemos a la próxima semana
        let diasParaSumar = diaCobro - diaActual;
        if (diasParaSumar <= 0) {
            diasParaSumar += 7; // Lo movemos a la próxima semana
        }

        const fechaInicioO = new Date();
        fechaInicioO.setDate(fechaInicioO.getDate() + diasParaSumar); // Asignamos la fecha de inicio

        // Calcular la fecha de caducidad (13 semanas después)
        const fechaDeCaducidadO = new Date(fechaInicioO);
        fechaDeCaducidadO.setDate(fechaDeCaducidadO.getDate() + 13 * 7);

        // Calcular la fecha del próximo pago (una semana después de la fecha de inicio)
        const fechaDeProximoPagoO = new Date(fechaInicioO);
        fechaDeProximoPagoO.setDate(fechaDeProximoPagoO.getDate() + 7);

        const cuota = parseFloat(monto) / 10;

        const prestamoGuardado = await Prestamo.create({
            monto,
            plazo:13,
            semana:0,
            cuota:cuota,
            totalApagar:cuota*13,
            fechaInicio: formatearFecha(fechaInicioO),
            fechaDeCaducidad: formatearFecha(fechaDeCaducidadO),
            fechaDeProximoPago: formatearFecha(fechaDeProximoPagoO),
            clienteId:cliente,
            rutaId:parseInt(rutaId),
            configuracionId: 1 // Asignar la configuración por defecto
        });

        res.redirect(`/prestamos/${rutaId}`);
    } catch (error) {
        console.log(error)
    }


}


// mostrar prestamos
const verPrestamo = async (req, res) => {
    try {
        const { idruta: rutaId, id:prestamoId } = req.params;
   
        const clientes = await Clientes.findAll({
            where: {
                rutaId: rutaId
            }
        });


        const prestamo = await Prestamo.findOne({
            where: {
                id: prestamoId,
                rutaId: rutaId
            },
            include: [
                { model: Clientes, as: 'cliente' },
                { model: Pagos, as: 'pagos' }
            ]
        });
        const ruta = await Rutas.findByPk(rutaId)

        // validar que la ruta exte
        
        if(!ruta){
            return res.redirect('/rutas')
        }

        // validar que el prestamo exista
        if(!prestamo){
            return res.redirect(`/prestamos/${rutaId}`)
        }




        res.render('prestamos/ver', {
            pagina:`Detalles del préstamo`,
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            clientes: clientes ? clientes : [],
            prestamo: prestamo,
            ruta:ruta,
            id:req.params.id
    
        })

    } catch (error) {
        console.log(error)
    }

    

}

const verRecibos = async (req, res) => {
    try {
        const { rutaId } = req.params;

        // Get the route
        const ruta = await Rutas.findByPk(rutaId);
        
        if(!ruta) {
            return res.redirect('/rutas');
        }

        // Get all loans for this route with their payments
        const prestamos = await Prestamo.findAll({
            where: {
                rutaId: rutaId
            },
            include: [
                { model: Clientes, as: 'cliente' },
                { model: Pagos, as: 'pagos' },
                { model: Configuracion, as: 'configuracion' },
                { model: Rutas, as: 'ruta' }
            ]
        });

        // Log para verificar los datos
        console.log('Prestamos con configuración:', prestamos.map(p => ({
            id: p.id,
            configuracionId: p.configuracionId,
            configuracion: p.configuracion
        })));

        res.render('prestamos/recibos', {
            pagina: 'Recibos de Préstamos',
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            ruta,
            prestamos
        });

    } catch (error) {
        console.log(error);
        res.redirect('/rutas');
    }
}

const imprimirRecibo = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get the loan with all its relationships
        const prestamo = await Prestamo.findOne({
            where: { id },
            include: [
                { model: Clientes, as: 'cliente' },
                { model: Rutas, as: 'ruta' },
                { model: Configuracion, as: 'configuracion' }
            ]
        });

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }
        const formatFecha = (fecha) =>
            new Date(fecha).toLocaleDateString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        // Format the receipt data according to the template
        const reciboData = {
            nombreCompania: prestamo.configuracion.nombreCompania,
            telefonos: `${prestamo.configuracion.telefono1}, ${prestamo.configuracion.telefono2}`,
            recibo: id,
            ruta: prestamo.ruta.nombre,
            cliente: prestamo.cliente.nombre,
            direccion: prestamo.cliente.direccion,
            telefono: prestamo.cliente.telefono,
            inicio: formatFecha(prestamo.fechaInicio),
            final: formatFecha(prestamo.fechaDeCaducidad),
            montoPrestado: new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.monto),
            pagoSemanal: new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.cuota)
        };

        res.json(reciboData);
        
        
        

    } catch (error) {
        console.error('Error al imprimir recibo:', error);
        res.status(500).json({ error: 'Error al generar el recibo', details: error.message });
    }
};

const imprimirTodosRecibos = async (req, res) => {
    try {
        const { rutaId } = req.params;

        if (!rutaId) {
            return res.status(400).json({ error: 'ID de ruta no proporcionado' });
        }

        // Get all loans for this route with their relationships
        const prestamos = await Prestamo.findAll({
            where: { rutaId },
            include: [
                { model: Clientes, as: 'cliente' },
                { model: Rutas, as: 'ruta' },
                { model: Configuracion, as: 'configuracion' }
            ]
        });

        if (!prestamos || prestamos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron préstamos para esta ruta' });
        }

        // Get default configuration for loans without one
        const configuracionDefault = await Configuracion.findByPk(1);

        // Format all receipts
        const recibos = prestamos.map(prestamo => {
            const config = prestamo.configuracion || configuracionDefault || {
                nombreCompania: 'Empresa',
                telefono1: 'N/A',
                telefono2: 'N/A'
            };

            return {
                nombreCompania: config.nombreCompania || 'Empresa',
                telefonos: `${config.telefono1 || 'N/A'}, ${config.telefono2 || 'N/A'}`,
                recibo: prestamo.id,
                ruta: prestamo.ruta?.nombre || 'N/A',
                cliente: prestamo.cliente?.nombre || 'N/A',
                direccion: prestamo.cliente?.direccion || 'N/A',
                telefono: prestamo.cliente?.telefono || 'N/A',
                inicio: prestamo.fechaInicio,
                final: prestamo.fechaDeCaducidad,
                montoPrestado: new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.monto),
                pagoSemanal: new Intl.NumberFormat("es-DO", {maximumFractionDigits: 3,}).format(prestamo.cuota)
            };
        });

        res.json(recibos);
    } catch (error) {
        console.error('Error al imprimir recibos:', error);
        res.status(500).json({ error: 'Error al generar los recibos', details: error.message });
    }
};

const buscarPrestamos = async (req, res) => {
    try {
        const { id: rutaId } = req.params;
        const { termino } = req.query;
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        // Construir la consulta base
        const baseQuery = {
            where: { rutaId },
            include: [
                {
                    model: Clientes,
                    as: 'cliente',
                    required: true
                },
                {
                    model: Pagos,
                    as: 'pagos',
                    required: false
                }
            ]
        };

        // Si hay término de búsqueda, añadir condiciones
        if (termino) {
            baseQuery.include[0].where = {
                [Op.or]: [
                    { id: { [Op.like]: `%${termino}%` } },
                    { nombre: { [Op.like]: `%${termino}%` } }
                ]
            };
        }

        // Obtener el total de préstamos
        const totalPrestamos = await Prestamo.count(baseQuery);

        // Si no hay resultados, devolver respuesta vacía
        if (totalPrestamos === 0) {
            return res.json({
                prestamos: [],
                paginacion: {
                    pagina: 1,
                    totalPaginas: 0,
                    totalPrestamos: 0,
                    limite
                }
            });
        }

        // Añadir paginación y orden a la consulta base
        const queryFinal = {
            ...baseQuery,
            limit: limite,
            offset: offset,
            order: [['createdAt', 'DESC']]
        };

        // Obtener los préstamos paginados
        const prestamosPaginados = await Prestamo.findAll(queryFinal);

        // Calcular total de páginas
        const totalPaginas = Math.ceil(totalPrestamos / limite);

        // Devolver resultados
        res.json({
            prestamos: prestamosPaginados,
            paginacion: {
                pagina,
                totalPaginas,
                totalPrestamos,
                limite
            }
        });

    } catch (error) {
        console.log('Error en la búsqueda:', error);
        res.status(500).json({ 
            error: 'Error al buscar préstamos',
            detalles: error.message 
        });
    }
};

const actualizarConfiguracionPrestamos = async (req, res) => {
    try {
        // Actualizar todos los préstamos que no tienen configuración
        await Prestamo.update(
            { configuracionId: 1 },
            { 
                where: { 
                    configuracionId: null 
                }
            }
        );

        res.json({ 
            success: true, 
            message: 'Configuración actualizada correctamente en todos los préstamos' 
        });
    } catch (error) {
        console.error('Error al actualizar la configuración:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar la configuración' 
        });
    }
};

export {
    formularioCrear,
    guardarPrestamo,
    verPrestamo,
    verRecibos,
    imprimirRecibo,
    imprimirTodosRecibos,
    buscarPrestamos,
    actualizarConfiguracionPrestamos
}