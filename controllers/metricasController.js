import Prestamo from '../modules/Prestamo.js';
import Pagos from '../modules/Pago.js';
import Clientes from '../modules/Cliente.js';
import { Op } from 'sequelize';

export const obtenerMetricas = async (req, res) => {
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

        res.json({
            totalGenerado,
            pagosUltimasSemanas,
            prestamosEstado,
            clientesEstado,
            tendenciasAtrasos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las métricas' });
    }
};