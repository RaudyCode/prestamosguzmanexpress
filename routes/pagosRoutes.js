import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protejerRuta.js";
import {  pagar, registrarPago, registrarRetraso, reporteRetrasos } from "../controllers/pagosController.js";
const router = express.Router();

router.get('/prestamo/pagar/:rutaId/:id',protegerRuta, pagar)

router.post('/prestamo/pagar/:rutaId/:id',[
    body('abono')
        .custom((value, { req }) => {
            if (!value || value.trim() === "") return true; // Si no existe, no validar
            if (!Number.isInteger(Number(value)) || Number(value) < 100) {
                throw new Error('El monto debe ser un número entero mayor o igual a 100');
            }
            return true;
        })
        
    ],
    protegerRuta,registrarPago
);


router.post('/prestamo/retraso/:id', protegerRuta, registrarRetraso);

router.get('/prestamos/retrasos', protegerRuta, reporteRetrasos);


export default router