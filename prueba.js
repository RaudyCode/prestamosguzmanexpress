import notifier from "node-notifier";

notifier.notify({
    title: 'Prueba de Notificación',
    message: 'Si ves esto, node-notifier está funcionando correctamente.',
    sound: true,
    wait: false
});
