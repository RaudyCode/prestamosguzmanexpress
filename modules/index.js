import Rutas from "./Ruta.js";
import Usuario from "./Usuario.js";
import Clientes from "./Cliente.js";
import Prestamo from "./Prestamo.js";
import Pagos from "./Pago.js";
import Configuracion from "./Configuracion.js";


Rutas.belongsTo(Usuario, {foreignKey: 'usuarioId'});
Rutas.hasMany(Clientes, { foreignKey: 'rutaId' });

Clientes.belongsTo(Rutas, { foreignKey: 'rutaId' });
// realcion con cnfiguracion
Prestamo.belongsTo(Configuracion, { foreignKey: 'configuracionId' });

Prestamo.belongsTo(Rutas, {foreignKey: 'rutaId'})
Prestamo.belongsTo(Clientes, {foreignKey: 'clienteId'})
Prestamo.hasMany(Pagos, {foreignKey: 'prestamoId', as: 'pagos'})



Pagos.belongsTo(Clientes, {foreignKey: 'clienteId'})
Pagos.belongsTo(Prestamo, {foreignKey: 'prestamoId'})

// Relación con Pagos
Rutas.hasMany(Pagos, { foreignKey: 'rutaId' });
Pagos.belongsTo(Rutas, { foreignKey: 'rutaId' });




export{
    Usuario,
    Clientes,
    Rutas,
    Prestamo,
    Pagos,
    Configuracion

}