import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const identificarUsuario = async (req, res, next) => {
  const { _jwt } = req.cookies;



  if (!_jwt) {
    req.usuario = null;
    return next();
  }

  try {
    const decoded = jwt.verify(_jwt, process.env.JWT_SECRET);
    const usuario = await Usuario.scope("eliminarAt").findByPk(decoded.id);

    if (usuario) {
      req.usuario = usuario;
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.clearCookie("_jwt").redirect("/auth/login");
  }
};

export default identificarUsuario;
