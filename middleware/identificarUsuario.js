import jwt from 'jsonwebtoken'
import Usuario from '../modules/Usuario.js'

const identificarUsuario = async (req, res, next) => {
    // identificar si hay token
    const {_token} = req.cookies;
    if(!_token){
        req.usuario = null
        return next();
    }

    // Comprobar el Token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        
        // Buscar el usuario
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        
        if(usuario) {
            req.usuario = usuario
        } else {
            return res.clearCookie('_token').redirect('/auth/login')
        }

        return next();
        
    } catch (error) {
        console.error('Error al verificar token:', error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}


export default identificarUsuario