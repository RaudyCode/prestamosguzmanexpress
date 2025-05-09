import Configuracion from '../modules/Configuracion.js';
import Ruta from '../modules/Ruta.js';  

const obtenerConfiguracion = async (req, res) => {
    const rutaId = req.params.rutaId;

    const ruta = await Ruta.findOne({ where: { id: rutaId } });
    try {
        const configuracion = await Configuracion.findOne({ where: { id: rutaId } });

        // Renderizar la vista de configuración con los datos obtenidos
        res.render('configuracion', {
            pagina: 'Configuración',
            configuracion: configuracion || { nombreCompania: '', telefono1: '', telefono2: '' },
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            ruta
        });
    } catch (error) {
        console.error('Error al obtener la configuración:', error);
        res.status(500).render('configuracion', {
            pagina: 'Configuración',
            error: 'Error al obtener la configuración',
            configuracion: { nombreCompania: '', telefono1: '', telefono2: '' }
        });
    }
};

const actualizarConfiguracion = async (req, res) => {
    const rutaId = req.params.rutaId;
    // obtener configuracion
    const configuracion = await Configuracion.findOne({ where: { id: 1 } });

    const { nombreCompania, telefono1, telefono2 } = req.body;

    // Reescribir el objeto y actualizarlo con los nuevos valores
    try {
        configuracion.set({
            nombreCompania,
            telefono1,
            telefono2
        });

        await configuracion.save();
        res.redirect(`/rutas/configuracion/${rutaId}`);
    } catch (error) {
        console.log(error);
    }
    
};

export { obtenerConfiguracion, actualizarConfiguracion };