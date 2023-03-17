import { validationResult } from "express-validator";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    barra: true,
  });
};

const crear = async (req, res) => {
  const categorias = await Categoria.findAll();
  const precios = await Precio.findAll();

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias: categorias,
    precios: precios,
    datos:{},
  });
};

const guardar = async (req, res) => {
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const categorias = await Categoria.findAll();
    const precios = await Precio.findAll();
    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      csrfToken: req.csrfToken(),
      errores: result.array(),
      barra: true,
      categorias: categorias,
      precios: precios,
      datos: req.body,
    });
  }
};

export { admin, crear, guardar };
