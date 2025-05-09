import {check, validationResult} from "express-validator"
import {Rutas, Clientes, Pagos, Prestamo} from "../modules/index.js";
import { formatearFecha } from "../helpers/fechas.js";
import { list } from "postcss";

const formularioCrear = async (req, res) => {
    
    try {
        const { id: rutaId } = req.params;

        const clientes = await Clientes.findAll({
            where: {
                rutaId: rutaId
            }
        });
        const prestamos = await Prestamo.findAll({
            where: {
                rutaId: rutaId
            },
            include: [
                {model: Clientes, as: 'cliente'},
            ] 
        });

        const ruta = await Rutas.findByPk(rutaId)

        // validar que la ruta este
        
        if(!ruta){
            return res.redirect('/rutas')
        }




        res.render('prestamos/pagos/crear', {
            pagina:"Gestión de Pagos",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            clientes: clientes ? clientes : [],
            prestamos: prestamos ? prestamos : [],
            ruta:ruta.nombre,
            id:req.params.id
    
        })

    } catch (error) {
        console.log(error)
    }

    


}


const pagar = async (req, res) => {
        
    try {
        const {rutaId, id: prestamoId } = req.params;
        
  


        // obtener prestamo asociado
        const ruta = await Rutas.findByPk(rutaId)
        const prestamo = await Prestamo.findByPk(prestamoId)



        // validar que el prestamo exista
        
        if(!prestamo && !ruta){
            return res.redirect('/rutas')
        }




        res.render('prestamos/pagos/pagar', {
            pagina:"Pago a Préstamo",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            prestamo,
            ruta:ruta,
            id:req.params.id
    
        })
    } catch (error) {
        console.log(error)
    }

}


const registrarPago = async (req, res, next) => {
    const resultado = validationResult(req);
    const { rutaId, id } = req.params;
    const { monto } = req.body; // Obtener tipo de pago y monto desde el formulario
    // Buscar la ruta y el préstamo en la base de datos

    const ruta = await Rutas.findByPk(rutaId);
    const prestamo = await Prestamo.findOne({
        where: {
            id,
            rutaId: rutaId
        },
        include: [
            { model: Pagos, as: 'pagos' }
        ]
    });
    // Validar que no haya errores

    if (!resultado.isEmpty() || !prestamo || !ruta)  {
        return res.render('prestamos/pagos/pagar', {
            pagina: "Pago a Préstamo",
            usuarioName: req.usuario.nombre,
            csrfToken: req.csrfToken(),
            prestamo,
            ruta,
            errores: resultado.array(),
            id: req.params.id
        });
    }

    try {
        
        // Calcular nuevas fechas
        const diaRuta = ruta.diaCobro; // Día fijo de la ruta (por ejemplo, "Lunes")

        // Crear un mapa para convertir el día de la semana a un índice numérico (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
        const diasSemana = {
            "Domingo": 0,
            "Lunes": 1,
            "Martes": 2,
            "Miércoles": 3,
            "Jueves": 4,
            "Viernes": 5,
            "Sábado": 6
        };

        // Obtener el índice del día de la ruta
        const diaRutaIndex = diasSemana[diaRuta];

        // Fecha actual
        const fechaActual = new Date();

        // Calcular el lunes pasado (o el día de la ruta pasado)
        let nuevaFechaUltimoPago = new Date(fechaActual);
        nuevaFechaUltimoPago.setDate(
            nuevaFechaUltimoPago.getDate() - ((nuevaFechaUltimoPago.getDay() + 7 - diaRutaIndex) % 7)
        );

        // Calcular el lunes siguiente (o el día de la ruta siguiente)
        let nuevaFechaProximoPago = new Date(nuevaFechaUltimoPago);
        nuevaFechaProximoPago.setDate(nuevaFechaUltimoPago.getDate() + 7);

        // Formatear las fechas antes de guardarlas
        prestamo.fechaDeUltimoPago = formatearFecha(nuevaFechaUltimoPago);
        prestamo.fechaDeProximoPago = formatearFecha(nuevaFechaProximoPago);

        // separar monto
        const [cantidad, tipo] = monto.split(',');

        const cuota = parseFloat(prestamo.cuota);
        let totalPagadoActual = parseFloat(prestamo.totalPagado) || 0;
        let abonadoActual = parseFloat(prestamo.abonado) || 0;
        let retrasoActual = parseFloat(prestamo.retraso) || 0;

        let nuevaSemana = prestamo.semana;

        if(tipo === 'saldoTotal'){
            abonadoActual = 0;
            totalPagadoActual = prestamo.totalApagar
            nuevaSemana = 13;
            retrasoActual = 0;
            prestamo.estado = "pagado";

            // Iterar sobre los pagos atrasados y cambiar su estado a "en mora"
            const pagosAtrasados = prestamo.pagos.filter(pago => pago.estadoPago === "atrasado");
            for (const pago of pagosAtrasados) {
                pago.estadoPago = "en mora";
                await pago.save(); // Guardar los cambios en la base de datos
            }

            await Pagos.create({
                monto: cantidad, // Reflejar el monto exacto pagado en esta transacción
                fecha: formatearFecha(fechaActual),
                semana: prestamo.semana,
                montoAbonado: prestamo.abonado,
                totalPagado: cantidad,
                estadoPago: "a tiempo",
                clienteId: prestamo.clienteId,
                prestamoId: prestamo.id,
                rutaId: prestamo.rutaId
            });

        } else if (tipo === 'abono') {
            // 1) Si hay atrasos, los pagamos primero
            if (prestamo.retraso > 0) {
              const { totalPagado, abonado, retraso, semana } =
                await pagarAtrasos(prestamo, cantidad);
          
              totalPagadoActual = totalPagado;
              abonadoActual     = abonado;
              retrasoActual     = retraso;
              nuevaSemana       = semana;
            } else {
              // 2) Si no hay atrasos, el abono se aplica directamente
              abonadoActual += parseFloat(cantidad);
            }
          
            // 3) Con cualquier abonadoActual restante, pagamos nuevas cuotas
            while (abonadoActual >= cuota) {
              abonadoActual    -= cuota;
              totalPagadoActual += cuota;
              nuevaSemana++;
          
              await Pagos.create({
                monto: cuota,
                fecha: formatearFecha(fechaActual),
                semana: nuevaSemana,
                montoAbonado: 0,
                totalPagado: cuota,
                estadoPago: "a tiempo",
                clienteId: prestamo.clienteId,
                prestamoId: prestamo.id,
                rutaId: prestamo.rutaId
              });
            }
          
            // 4) Guardamos el préstamo una sola vez
            prestamo.totalPagado   = totalPagadoActual;
            prestamo.abonado       = abonadoActual;
            prestamo.retraso       = retrasoActual;
            prestamo.semana        = nuevaSemana;
            await prestamo.save();
          }else{

            if(prestamo.retraso > 0){
                retrasoActual -= prestamo.cuota;
                totalPagadoActual += Number(prestamo.cuota)
                await pagarAtrasos(prestamo, cantidad);



                // Registrar el retraso como un pago atrasado en la tabla Pagos
                await Pagos.create({
                    monto: cuota,
                    fecha: formatearFecha(new Date()),
                    semana: prestamo.semana, // Registrar la semana atrasada
                    montoAbonado: 0.00,
                    totalPagado: 0.00, // No se incrementa el total pagado porque es un retraso
                    estadoPago: "atrasado",
                    clienteId: prestamo.clienteId,
                    prestamoId: prestamo.id,
                    rutaId: prestamo.rutaId
                });

                // Actualizar los campos del préstamo
                retrasoActual += cuota ;
                nuevaSemana += 1;
                prestamo.semanasAtrasadas += 1;
                prestamo.retraso = retrasoActual;
                prestamo.semana = nuevaSemana;
                prestamo.totalPagado = totalPagadoActual;

                await prestamo.save(); 

            }else{
                await Pagos.create({
                    monto: cuota, // Reflejar el monto exacto pagado en esta transacción
                    fecha: formatearFecha(fechaActual),
                    semana: prestamo.semana,
                    montoAbonado: prestamo.abonado,
                    totalPagado: cuota,
                    estadoPago: "a tiempo",
                    clienteId: prestamo.clienteId,
                    prestamoId: prestamo.id,
                    rutaId: prestamo.rutaId
                });
    
                totalPagadoActual += cuota; // Registrar el pago de la cuota
                nuevaSemana++; // Avanzar una semana
            }

            
        }
        
        prestamo.semana = nuevaSemana;
        prestamo.abonado = abonadoActual;
        prestamo.retraso = retrasoActual;
        prestamo.totalPagado = totalPagadoActual;
        prestamo.fechaDeUltimoPago = formatearFecha(nuevaFechaUltimoPago);
        prestamo.fechaDeProximoPago = formatearFecha(nuevaFechaProximoPago);

        await prestamo.save()

        res.redirect(`/prestamo/ver/${prestamo.rutaId}/${prestamo.id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al procesar el pago.");
    }
};


// pagar los atrasados
const pagarAtrasos = async (prestamo, montoPagadoInicial) => {
    // 1. Carga un estado fresco del préstamo con sus pagos
    const prest = await Prestamo.findByPk(prestamo.id, {
      include: [{ model: Pagos, as: 'pagos' }]
    });
  
    const cuota = parseFloat(prest.cuota);
    let montoPagado = parseFloat(montoPagadoInicial);
    let totalPagado = parseFloat(prest.totalPagado) || 0;
    let abonado     = parseFloat(prest.abonado)     || 0;
    let retraso     = parseFloat(prest.retraso)     || 0;
    let semana      = prest.semana;
    
    // 2. Ordena los pagos atrasados
    const atrasados = prest.pagos
      .filter(p => p.estadoPago === 'atrasado')
      .sort((a,b) => a.createdAt - b.createdAt);
  
    // 3. Saldar cuotas atrasadas mientras haya monto y cuotas pendientes
    for (const pago of atrasados) {
      if (montoPagado < cuota) break;
      montoPagado -= cuota;
      totalPagado += cuota;
      retraso   -= cuota;
      semana++;
      pago.totalPagado = cuota;
      pago.estadoPago  = 'en mora';
      await pago.save();
    }
  
    // 4. Lo que quede es abono para nuevas cuotas
    abonado += montoPagado;
  
    // 5. Guarda cambios en el préstamo y devuelve estado
    prest.totalPagado = totalPagado;
    prest.abonado     = abonado;
    prest.retraso     = retraso;
    prest.semana      = semana;
    await prest.save();
  
    return { totalPagado, abonado, retraso, semana };
};
  

// Registrar retraso
const registrarRetraso = async (req, res) => {
    const { id } = req.params;

    try {
        const prestamo = await Prestamo.findByPk(id);

        if (!prestamo) {
            return res.redirect('/rutas');
        }

        const cuota = parseFloat(prestamo.cuota);
        let retrasoActual = parseFloat(prestamo.retraso) || 0;
        
        retrasoActual += cuota;

        // Registrar el retraso como un pago atrasado en la tabla Pagos
        await Pagos.create({
            monto: cuota,
            fecha: formatearFecha(new Date()),
            semana: prestamo.semana, // Registrar la semana atrasada
            montoAbonado: 0.00,
            totalPagado: 0.00, // No se incrementa el total pagado porque es un retraso
            estadoPago: "atrasado",
            clienteId: prestamo.clienteId,
            prestamoId: prestamo.id,
            rutaId: prestamo.rutaId
        });

        // Actualizar los campos del préstamo
        prestamo.retraso = retrasoActual;
        prestamo.semana += 1;
        prestamo.semanasAtrasadas += 1;
        prestamo.estado = "moroso";

        await prestamo.save();

        res.redirect(`/prestamo/ver/${prestamo.rutaId}/${id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al registrar el retraso.");
    }
};

const reporteRetrasos = async (req, res) => {
    try {
        const prestamos = await Prestamo.findAll({
            where: { retraso: { [Op.gt]: 0 } },
            include: [{ model: Clientes, as: 'cliente' }]
        });

        res.render('prestamos/retrasos', { prestamos });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al generar el reporte.");
    }
};

export{
    formularioCrear,
    pagar,
    registrarPago,
    registrarRetraso,
    reporteRetrasos
}