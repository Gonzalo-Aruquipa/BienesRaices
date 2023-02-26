import Usuario from "../models/Usuario.js"
const formularioLogin = (req, res) => {
  res.render("auth/login",{
    pagina: "Iniciar Sesión"
  })
}

const formularioRegistro = (req, res) => {
  res.render("auth/registro",{
    pagina: "Crear Cuenta"
  })
}

const registrar = async(req, res) => {
  const {nombre, email, password} = req.body;
  
  try {
    const usuario = await Usuario.create({ 
      nombre: nombre,
      email: email,
      password: password,
      token: "123"
    });
    res.status(202).send(usuario)
  } catch (error) {
    console.log(error)
  }

}

const recuperarPassword = (req, res) => {
  res.render("auth/recuperar-password",{
    pagina: "Recuperar Contraseña"
  })
}
export {
  formularioLogin,
  formularioRegistro,
  registrar,
  recuperarPassword,
}
