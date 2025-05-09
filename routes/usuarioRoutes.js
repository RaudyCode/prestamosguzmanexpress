import express from "express";
import { formulariologin, cerrarSesion , autenticar, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword} from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formulariologin)
router.post('/login', autenticar)

// cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

  
router.post('/registro', registrar)
router.get('/registro', formularioRegistro)
router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', resetPassword)


// Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);



export default router