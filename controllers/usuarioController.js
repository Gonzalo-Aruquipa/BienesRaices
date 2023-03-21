import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { generarId, generarToken } from "../helpers/tokens.js";
import { emailRegister, emailRecover } from "../helpers/emails.js";

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
      errores: result.array(),
      usuario: {
        nombre: nombre,
        email: email,
      },
    });
  }

  const existsUser = await Usuario.findOne({ where: { email } });
  if (existsUser) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: nombre,
        email: email,
      },
    });
  }

  const usuario = await Usuario.create({
    nombre: nombre,
    email: email,
    password: password,
    token: generarId(),
  });
  const salt = await bcrypt.genSaltSync(10);
  usuario.password = await bcrypt.hashSync(usuario.password, salt);
  await usuario.save();

  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "se envió un mensaje de verificación a su correo",
  });

  emailRegister({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
};
const confirmar = async (req, res) => {
  const { token } = req.params;

  const user = await Usuario.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/confirmar", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Intente de nuevo",
      error: true,
    });
  }
  user.token = null;
  user.confirmado = true;
  await user.save();
  res.render("auth/confirmar", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmó correctamente",
  });
};
const recuperarPassword = (req, res) => {
  res.render("auth/recuperar-password", {
    pagina: "Recuperar Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("example@example.com").run(req);
  let result = validationResult(req);
  //verification length
  if (!result.isEmpty()) {
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: result.array(),
    });
  }
  const { email } = req.body;

  const user = await Usuario.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/recuperar-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email introducido no está registrado" }],
    });
  }

  user.token = generarId();
  await user.save();

  //send email

  emailRecover({
    nombre: user.nombre,
    email: user.email,
    token: user.token,
  });

  res.render("templates/mensaje", {
    pagina: "Reestablece tu Contraseña",
    mensaje: "Se envió un email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const user = await Usuario.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/confirmar", {
      pagina: "Reestablece tu Contraseña",
      mensaje: "Hubo un error en la validación, intenta de nuevo",
      error: true,
    });
  }

  res.render("auth/reset-password", {
    pagina: "Reestablece tu Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  await check("password")
    .isLength({ min: 6 })
    .withMessage("Min 6 caracteres")
    .run(req);

  let result = validationResult(req);
  //verification length
  if (!result.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Reestablece tu Contraseña",
      csrfToken: req.csrfToken(),
      errores: result.array(),
    });
  }

  const user = await Usuario.findOne({ where: { token } });

  const salt = await bcrypt.genSaltSync(10);
  const passCrypt = await bcrypt.hashSync(password, salt);
  user.password = passCrypt;

  user.token = null;
  await user.save();

  res.render("auth/confirmar", {
    pagina: "Contraseña Reestablecida",
    mensaje: "La nueva contraseña se guardó correctamente",
  });
};

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  await check("email").isEmail().withMessage("Email Inválido").run(req);
  await check("password")
    .notEmpty()
    .withMessage("El password es obligatorio")
    .run(req);

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: result.array(),
      usuario: {
        email: email,
      },
    });
  }

  const user = await Usuario.findOne({where:{ email }});

  if (!user) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg: "El usuario no existe"}]
    });
  }

  if (!user.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg: "El usuario no está confirmado, revise su email"}]
    });
  }

  const validPassword = await bcrypt.compareSync(password, user.password);
  if(!validPassword){
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errores: [{msg: "Contraseña Incorrecta"}],
      usuario: {
        email: email,
      },
    });
  }

  const token = generarToken({id: user.id, nombre: user.nombre})
  return res.cookie("_jwt", token, {
    httpOnly: true,
  }).redirect("/mis-propiedades")
  
};
export {
  formularioRegistro,
  registrar,
  confirmar,
  recuperarPassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  formularioLogin,
  autenticar,
};
