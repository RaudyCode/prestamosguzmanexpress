import express from "express";
import { body } from "express-validator";
import { crear, guardar, admin, editar, guardarCambios, eliminar, alerta } from "../controllers/rutasCotroller.js";
import protegerRuta from "../middleware/protejerRuta.js";


const router = express.Router();

router.get('/rutas',protegerRuta, crear)
router.post('/rutas', protegerRuta,
    [
        body('nombre').notEmpty().withMessage("El nombre de la ruta es Obligatorio"),
        body('capital').notEmpty().withMessage("El Capital de la ruta es Obligatorio"),
    ],
    guardar, 
    
)

router.get('/rutas/editar/:id', 
    protegerRuta,
    editar
)
router.post('/rutas/editar/:id', 
    protegerRuta,
    [
        body('nombre').notEmpty().withMessage("El nombre de la ruta es Obligatorio"),
        body('capital').notEmpty().withMessage("El Capital de la ruta es Obligatorio"),
    ],
    guardarCambios
)

router.get('/rutas/admin/:id', protegerRuta, admin)



router.post('/rutas/eliminar/:id', 
    protegerRuta,
    eliminar,
)

router.get('/alerta/:id', alerta)

export default router