import express from "express";
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoute from './routes/usuarioRoutes.js'
import clientesRoutes from './routes/clientesRoutes.js'
import rutasRouter from './routes/rutasRoutes.js'
import prestamosRouter from './routes/prestamosRoutes.js'
import pagosRouter from './routes/pagosRoutes.js'
import apiRouter from './routes/apiRoutes.js'
import db from "./config/db.js";
import configuracionRouter from './routes/configuracionRoutes.js'
import { cookie } from 'express-validator';

// iniciar la app con express
const app = express();

// habilitar lecturas de datos del formulario
app.use(express.urlencoded({extended: true}))

// habilitar cookie parser
app.use(cookieParser())

// habilitar CSRF
app.use(csrf({cookie: true}))

// conecxion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log("Conexion correcta a la base de datos")
} catch (error) {
    console.log(error)
}

// habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// habilitar Carpeta publica
app.use( express.static('public'))
// Routes
app.use('/auth', usuarioRoute)
app.use('/', clientesRoutes)
app.use('/', rutasRouter)
app.use('/', prestamosRouter)
app.use('/', pagosRouter)
app.use('/', configuracionRouter);
app.use('/api', apiRouter )

// iniciar servidor
// definir un puerto y arrancar el proyecto
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})

