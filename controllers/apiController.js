import { Prestamo, Pagos, Clientes, Rutas, Configuracion } from '../modules/index.js';
import { Op } from 'sequelize';

export const obtenerPrestamos = async (req, res) => {
    const { rutaId } = req.query; // Obtener el parámetro rutaId de la consulta

    try {
        // Filtrar los préstamos por rutaId
        const prestamos = await Prestamo.findAll({
            where:{
                ...(rutaId && { rutaId }), // Filtrar solo si rutaId está presente
                semana: {
                    [Op.lte]: 13 // Filtrar donde semana sea menor o igual a 13
                }
            },
            include: [
                { model: Rutas, as: 'ruta', attributes: ['nombre'] },
                { model: Pagos, as: 'pagos' },
                { model: Clientes, as: 'cliente' },
                { model: Configuracion, as: 'configuracion' }
            ]
        });

        res.json(prestamos);
    } catch (error) {
        console.error('Error al obtener los préstamos:', error);
        res.status(500).json({ error: 'Error al obtener los préstamos' });
    }
};

export const obtenerMetricasPorRuta = async (req, res) => {
    const { rutaId } = req.params;
    const { filtro } = req.query; // Obtener el filtro desde los parámetros de consulta

    try {
        // Validar que la ruta exista
        const ruta = await Rutas.findByPk(rutaId);
        if (!ruta) {
            return res.status(404).json({ error: 'La ruta no existe' });
        }

        // Determinar el rango de fechas según el filtro
        const fechaInicio = new Date();
        if (filtro === 'mes') {
            fechaInicio.setMonth(fechaInicio.getMonth() - 1); // Último mes
        } else if (filtro === 'año') {
            fechaInicio.setFullYear(fechaInicio.getFullYear() - 1); // Último año
        } else {
            fechaInicio.setDate(fechaInicio.getDate() - 7); // Última semana (por defecto)
        }

        // Pagos recibidos en el rango de fechas, clasificados por estado
        const pagosUltimasSemanas = await Pagos.findAll({
            where: {
                rutaId,
                fecha: {
                    [Op.gte]: fechaInicio
                }
            },
            attributes: ['estadoPago', [Pagos.sequelize.fn('SUM', Pagos.sequelize.col('monto')), 'total']],
            group: ['estadoPago']
        });

        const pagosClasificados = pagosUltimasSemanas.map(pago => ({
            estado: pago.estadoPago,
            total: parseFloat(pago.dataValues.total)
        }));

        // Estado de los préstamos
        const prestamosEstado = await Prestamo.findAll({
            where: { 
                rutaId,
                fechaDeUltimoPago: {
                    [Op.gte]: fechaInicio
                } 
            },
            attributes: ['estado', [Prestamo.sequelize.fn('COUNT', Prestamo.sequelize.col('estado')), 'cantidad']],
            group: ['estado']
        });

        const prestamosClasificados = prestamosEstado.map(prestamo => ({
            estado: prestamo.estado,
            cantidad: parseInt(prestamo.dataValues.cantidad)
        }));

        // Estado de los clientes
        const clientesEstado = await Clientes.findAll({
            where: { rutaId },
            attributes: ['estado', [Clientes.sequelize.fn('COUNT', Clientes.sequelize.col('estado')), 'cantidad']],
            group: ['estado']
        });

        const clientesClasificados = clientesEstado.map(cliente => ({
            estado: cliente.estado,
            cantidad: parseInt(cliente.dataValues.cantidad)
        }));

        // Tendencias de atrasos
        const tendenciasAtrasos = await Prestamo.findAll({
            where: { rutaId },
            attributes: ['semanasAtrasadas', [Prestamo.sequelize.fn('COUNT', Prestamo.sequelize.col('semanasAtrasadas')), 'cantidad']],
            group: ['semanasAtrasadas']
        });

        const atrasosClasificados = tendenciasAtrasos.map(atraso => ({
            semanasAtrasadas: parseInt(atraso.semanasAtrasadas),
            cantidad: parseInt(atraso.dataValues.cantidad)
        }));

        // Total generado por pagos
        const totalGenerado = await Pagos.sum('totalPagado', {
            where: { 
                rutaId,
                fecha: {
                    [Op.gte]: fechaInicio
                }
            }
        });

        // Enviar los datos al frontend
        res.json({
            ruta: ruta.nombre,
            totalGenerado: totalGenerado || 0,
            pagosClasificados,
            prestamosClasificados,
            clientesClasificados,
            atrasosClasificados
        });
    } catch (error) {
        console.error('Error en obtenerMetricasPorRuta:', error);
        res.status(500).json({ error: 'Error al obtener las métricas por ruta' });
    }
};