import {check, validationResult} from "express-validator"
import bcrypt from 'bcrypt'
import Usuario from "../modules/Usuario.js"
import {GenerarJWT, generarId } from "../helpers/tokens.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"

const formulariologin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesion",
        csrfToken: req.csrfToken()
    })
    

}

const cerrarSesion = async(req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const autenticar = async (req, res) => {
    // validar email y password
    // si es un email
    await check('email').isEmail().withMessage('EL email es Obligatorio').run(req);
    // si al menos tiene 6 caracteres
    await check('password').notEmpty().withMessage("El Password es Obligatorio").run(req)
    let resultado = validationResult(req)

    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: "Iniciar Seccion",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),

        })
    }

    const {email, password} = req.body
    
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/login', {
            pagina: "Iniciar Seccion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El Usuario no Existe"}],

        })
    }

    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: "Iniciar Seccion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "Tu cuenta no ha sido confrimada"}],

        })
    }

    // comprobar password
    if(!usuario.veryficarPassword(password)){
        return res.render('auth/login', {
            pagina: "Iniciar Seccion",
            csrfToken: req.csrfToken(),
            errores: [{msg: "El Password es Incorrecto"}],

        })
    }

    // autenticar usuario
    const token = GenerarJWT({
        id: usuario.id,
        nombre: usuario.nombre
    })
    console.log(token)

    // almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true,
        //sameSite: true
    }).redirect('/rutas')
    
}




const formularioRegistro = (req, res) => {
    
    res.render('auth/registro', {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
    })

}

const registrar = async (req, res) => {

    // validacion
    // si esta vacio
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    // si es un email
    await check('email').isEmail().withMessage('Eso no es un email').run(req);
    // si al menos tiene 6 caracteres
    await check('password').isLength({min: 6}).withMessage("El password debe terner al menos 6 caracteres").run(req)
    // si es igual a lo que tiene el inpunt de password
    await check('repetir_password').custom((value, { req }) => value === req.body.password).withMessage("Los password no son iguales").run(req);


    let resultado = validationResult(req)

    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                emal: req.body.email
            }


        })
    }

    // extraer los datos
    const {nombre, email, password} = req.body;

    // verificar si ya existe usuario
    const existeUsuario = await Usuario.findOne({where : {email}});

    if(existeUsuario){
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores:  [{msg:"El usuario ya esta registrado"}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }


        })
    }

    // Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token:generarId()
    })

    // Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    // Mostrar mensaje de confirmacion 

    res.render('template/mensaje', {
        pagina: "Cuenta Creada Correctamente",
        mensaje: "Hemos Enviado un Email de Confirmacion, presiona en el enlace"
    })


}

// funcion que comprueba la cuenta
const confirmar = async (req, res) => {

    const {token} = req.params;
    

    // verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: "Error al confirmar tu Cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta intente de nuevo",
            error: true


        })
    }

    // confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

   res.render('auth/confirmar-cuenta', {
        pagina: "Cuenta Confirmada",
        mensaje: "La cuenta se Confirmo correctamente",
        error: false


    })
 
}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu acceso a Bienes Raices",
        csrfToken: req.csrfToken()
    })

}

const resetPassword = async (req, res) =>{
    // si es un email
    await check('email').isEmail().withMessage('Eso no es un email').run(req);
 

    let resultado = validationResult(req)

    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: resultado.array()

        })
    }


    // Buscar el usuario
    const {email} = req.body;

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no Pertenece a ningun usuario'}]

        })
    }

    // Generar un token y Enviar el email
    usuario.token = generarId();
    await usuario.save();

    // enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje
    res.render('template/mensaje', {
        pagina: "Restablece tu password",
        mensaje: "Hemos enviado un email con la instrucciones"
    })

    

}

const comprobarToken = async (req, res)=>{
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        res.render('auth/confirmar-cuenta', {
            pagina: "Reestablece tu password",
            mensaje: "Huvo un error al validar tu informacion, intenta de nuevo",
            error:true
        })
    }


    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina:'Restablece Tu Password',
        csrfToken: req.csrfToken()
    })
}


const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({min: 6}).withMessage("El password debe terner al menos 6 caracteres").run(req)

    let resultado = validationResult(req)

    //return res.json(resultado.array())
    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Restablece Tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const {token} = req.params
    const {password} = req.body
   
    // identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})

    console.log(usuario)

    // hashear nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: "Password Restablecido",
        mensaje: "El Password se guardo Correctamente",
        error: false


    })
 

}

export {
    formulariologin,
    cerrarSesion,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
