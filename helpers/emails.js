import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;


const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { nombre, email, token } = data;
  await transport.sendMail({
    from: "Bienes raices",
    to: email,
    subject: "Confirmar Cuentaa",
    text: "Confirme su cuenta",
    html: `
      <p> Hola! ${nombre}, confirma tu cuenta en Bienes Raices </p>
      <p> Confirma tu cuenta en el siguiente enlace:
      <a href="http://localhost:3000/auth/confirma/${token}"> Confirmar cuenta </a></p>
      <p> Si no creaste la cuenta, ignora el mensaje</p>`,
  });
};

export {
  emailRegister
}
