import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protejerRuta.js";
import { 
    formularioCrear, 
    guardarPrestamo, 
    verPrestamo, 
    verRecibos, 
    imprimirRecibo, 
    imprimirTodosRecibos, 
    buscarPrestamos,
    actualizarConfiguracionPrestamos
} from "../controllers/prestamosController.js";
import { pagar, registrarPago } from "../controllers/pagosController.js";

const router = express.Router();

// Rutas para prestamos
router.get('/prestamos/:id', protegerRuta, formularioCrear);
router.post('/prestamos/:id', protegerRuta, guardarPrestamo);
router.get('/prestamos/ver/:idruta/:id', protegerRuta, verPrestamo);
router.get('/prestamos/recibos/:rutaId', protegerRuta, verRecibos);
router.get('/prestamos/imprimir-recibo/:id', protegerRuta, imprimirRecibo);
router.get('/prestamos/imprimir-todos/:rutaId', protegerRuta, imprimirTodosRecibos);
router.get('/prestamos/:id/buscar', protegerRuta, buscarPrestamos);
router.post('/prestamos/actualizar-configuracion', protegerRuta, actualizarConfiguracionPrestamos);

// Rutas para pagos
router.get('/prestamos/pagar/:rutaId/:id', protegerRuta, pagar);
router.post('/prestamos/pagar/:rutaId/:id', protegerRuta, registrarPago);

export default router;