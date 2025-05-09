import express from "express";
import { body } from "express-validator";
import protegerRuta from "../middleware/protejerRuta.js";
import { gestionCliente, guardarCliente, editar, guardarCambios, mostrarCliente, buscarClientes } from "../controllers/clientesController.js";

const router = express.Router();

router.get('/clientes/:id', protegerRuta, gestionCliente);

// Nueva ruta para la búsqueda de clientes
router.get('/clientes/:id/buscar', protegerRuta, buscarClientes);

router.post('/clientes/:id', protegerRuta,
    [
        body('nombre')
            .notEmpty().withMessage('El nombre es obligatorio'),

        body('cedula')
            .notEmpty().withMessage('La cédula es obligatoria'),

        body('telefono')
            .notEmpty().withMessage('El teléfono es obligatorio'),

        body('direccion')
            .notEmpty().withMessage('La dirección es obligatoria')
    ],
    guardarCliente
);

router.get('/cliente/editar/:id', protegerRuta, editar);

router.get('/cliente/ver/:idruta/:id', protegerRuta, mostrarCliente);

router.post('/cliente/editar/:id', protegerRuta,
    [
        body('nombre')
            .notEmpty().withMessage('El nombre es obligatorio'),

        body('cedula')
            .notEmpty().withMessage('La cédula es obligatoria'),

        body('telefono')
            .notEmpty().withMessage('El teléfono es obligatorio'),

        body('direccion')
            .notEmpty().withMessage('La dirección es obligatoria')
    ],
    guardarCambios
);

export default router;