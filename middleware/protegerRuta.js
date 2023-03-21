import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";
const protegerRuta = async (req, res, next) => {
  const { _jwt } = req.cookies;

  if (!_jwt) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(_jwt, process.env.JWT_SECRET);
    const usuario = await Usuario.scope("eliminarAt").findByPk(decoded.id);
    if (usuario) {
      req.usuario = usuario;
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    return res.clearCookie("_jwt").redirect("/auth/login");
  }
};

export default protegerRuta;
