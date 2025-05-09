import express from 'express'
import {obtenerPrestamos, obtenerMetricasPorRuta} from '../controllers/apiController.js'
const router = express.Router()

router.get('/prestamos',obtenerPrestamos);

// Ruta para obtener las métricas
router.get('/metricas/:rutaId', obtenerMetricasPorRuta);


export default router