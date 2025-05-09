const prestamos = [
    // Préstamos de la Ruta 1 (IDs 1-35)
    { monto: 1000, plazo: 13, semana: 0, cuota: 100, abonado: 0, totalApagar: 1300, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-19', estado: 'activo', rutaId: 1, clienteId: 1 },
    { monto: 800, plazo: 13, semana: 0, cuota: 80, abonado: 0, totalApagar: 1040, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-20', estado: 'activo', rutaId: 1, clienteId: 2 },
    { monto: 1200, plazo: 13, semana: 0, cuota: 120, abonado: 0, totalApagar: 1560, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-19', fechaDeCaducidad: '2025-05-21', estado: 'activo', rutaId: 1, clienteId: 3 },
    { monto: 950, plazo: 13, semana: 0, cuota: 95, abonado: 0, totalApagar: 1235, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-20', fechaDeCaducidad: '2025-05-22', estado: 'activo', rutaId: 1, clienteId: 4 },
    { monto: 1100, plazo: 13, semana: 0, cuota: 110, abonado: 0, totalApagar: 1430, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-21', fechaDeCaducidad: '2025-05-23', estado: 'activo', rutaId: 1, clienteId: 5 },
    
    // Additional loans for Route 1 (16-35)
    ...Array.from({length: 20}, (_, i) => {
        const startDate = new Date('2025-02-22');
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date('2025-05-19');
        endDate.setDate(endDate.getDate() + i);
        return {
            monto: 750 + (i * 50),
            plazo: 13,
            semana: 0,
            cuota: (750 + (i * 50)) / 10,
            abonado: 0,
            totalApagar: (750 + (i * 50)) * 1.3,
            totalPagado: 0,
            retraso: 0,
            semanasAtrasadas: 0,
            fechaInicio: startDate.toISOString().split('T')[0],
            fechaDeCaducidad: endDate.toISOString().split('T')[0],
            estado: 'activo',
            rutaId: 1,
            clienteId: i + 16
        };
    }),

    // Préstamos de la Ruta 2 (IDs 6-10, 36-50)
    { monto: 1500, plazo: 13, semana: 0, cuota: 150, abonado: 0, totalApagar: 1950, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-24', estado: 'activo', rutaId: 2, clienteId: 6 },
    { monto: 700, plazo: 13, semana: 0, cuota: 70, abonado: 0, totalApagar: 910, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-25', estado: 'activo', rutaId: 2, clienteId: 7 },
    { monto: 1300, plazo: 13, semana: 0, cuota: 130, abonado: 0, totalApagar: 1690, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-26', estado: 'activo', rutaId: 2, clienteId: 8 },
    { monto: 950, plazo: 13, semana: 0, cuota: 95, abonado: 0, totalApagar: 1235, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-27', estado: 'activo', rutaId: 2, clienteId: 9 },
    { monto: 850, plazo: 13, semana: 0, cuota: 85, abonado: 0, totalApagar: 1105, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-26', fechaDeCaducidad: '2025-05-28', estado: 'activo', rutaId: 2, clienteId: 10 },
    
    // Additional loans for Route 2 (36-50)
    ...Array.from({length: 15}, (_, i) => {
        const startDate = new Date('2025-02-27');
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date('2025-05-29');
        endDate.setDate(endDate.getDate() + i);
        return {
            monto: 750 + (i * 50),
            plazo: 13,
            semana: 0,
            cuota: (750 + (i * 50)) / 10,
            abonado: 0,
            totalApagar: (750 + (i * 50)) * 1.3,
            totalPagado: 0,
            retraso: 0,
            semanasAtrasadas: 0,
            fechaInicio: startDate.toISOString().split('T')[0],
            fechaDeCaducidad: endDate.toISOString().split('T')[0],
            estado: 'activo',
            rutaId: 2,
            clienteId: i + 36
        };
    }),

    // Préstamos de la Ruta 3 (IDs 11-15, 51-67)
    { monto: 1600, plazo: 13, semana: 0, cuota: 160, abonado: 0, totalApagar: 2080, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-29', estado: 'activo', rutaId: 3, clienteId: 11 },
    { monto: 750, plazo: 13, semana: 0, cuota: 75, abonado: 0, totalApagar: 975, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-30', estado: 'activo', rutaId: 3, clienteId: 12 },
    { monto: 1400, plazo: 13, semana: 0, cuota: 140, abonado: 0, totalApagar: 1820, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-05-31', estado: 'activo', rutaId: 3, clienteId: 13 },
    { monto: 1000, plazo: 13, semana: 0, cuota: 100, abonado: 0, totalApagar: 1300, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-06-01', estado: 'activo', rutaId: 3, clienteId: 14 },
    { monto: 900, plazo: 13, semana: 0, cuota: 90, abonado: 0, totalApagar: 1170, totalPagado: 0, retraso: 0, semanasAtrasadas: 0, fechaInicio: '2025-02-24', fechaDeCaducidad: '2025-06-02', estado: 'activo', rutaId: 3, clienteId: 15 },
    
    // Additional loans for Route 3 (51-67)
    ...Array.from({length: 17}, (_, i) => {
        const startDate = new Date('2025-02-25');
        startDate.setDate(startDate.getDate() + i);
        const endDate = new Date('2025-06-03');
        endDate.setDate(endDate.getDate() + i);
        return {
            monto: 800 + (i * 50),
            plazo: 13,
            semana: 0,
            cuota: (800 + (i * 50)) / 10,
            abonado: 0,
            totalApagar: (800 + (i * 50)) * 1.3,
            totalPagado: 0,
            retraso: 0,
            semanasAtrasadas: 0,
            fechaInicio: startDate.toISOString().split('T')[0],
            fechaDeCaducidad: endDate.toISOString().split('T')[0],
            estado: 'activo',
            rutaId: 3,
            clienteId: i + 51
        };
    })
].flat();

export default prestamos;