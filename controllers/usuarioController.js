import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;

  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("formato de email inválido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Min 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals(password)
    .withMessage("La contraseña no coincide")
    .run(req);

  let result = validationResult(req);
  //verification length
  if (!result.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: result.array(),
      usuario: {
        nombre: nombre,
        email: email
      }
    })
  }

  try {
    const usuario = await Usuario.create({
      nombre: nombre,
      email: email,
      password: password,
      token: "123",
    });
    res.status(202).send(usuario);
  } catch (error) {
    console.log(error);
  }
};

const recuperarPassword = (req, res) => {
  res.render("auth/recuperar-password", {
    pagina: "Recuperar Contraseña",
  });
};
export { formularioLogin, formularioRegistro, registrar, recuperarPassword };
