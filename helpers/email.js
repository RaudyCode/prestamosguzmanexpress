import nodemailer from 'nodemailer';

const emailRegistro = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    // enviar el email
    await transport.sendMail({
        from: "PrestaG.com",
        to:email,
        subject: 'Confirma tu cuenta en PrestaG.com',
        text: 'Confirma tu cuenta en PrestaG.com',
        html:`
            <p> Hola ${nombre}, comprueba tu cuenta en PrestaG.com</p>

            <p> Tu cuenta ya esta lista solo debes confirmarla en el siguiente enlace <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>

            <p> Si tu no Creaste esta cuenta, Puedes ignorar el mensaje</p>


        `
    })
}

const emailOlvidePassword = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {nombre, email, token} = datos;

    // enviar el email
    await transport.sendMail({
        from: "PrestaG.com",
        to:email,
        subject: 'Restablece tu password en PrestaG.com',
        text: 'Restablece tu password en PrestaG.com',
        html:`
            <p> Hola ${nombre}, has solicitado restablecer tu password en PrestaG.com</p>

            <p> Sigue el siguiente enlace para generar un password nuevo: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/olvide-password/${token}">Restablecer Password</a> </p>

            <p> Si tu no Solicitaste el cambio de password, Puedes ignorar el mensaje</p>


        `
    })
}



export {
    emailRegistro,
    emailOlvidePassword
}