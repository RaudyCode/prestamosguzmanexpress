import express from 'express';
import { body } from "express-validator";
import protegerRuta from "../middleware/protejerRuta.js";
import {obtenerConfiguracion, actualizarConfiguracion } from '../controllers/configuracionController.js';

const router = express.Router();

router.get('/rutas/configuracion/:rutaId',protegerRuta, obtenerConfiguracion);
router.post('/rutas/configuracion/:rutaId',protegerRuta, actualizarConfiguracion);

export default router;