import { validationResult } from "express-validator";
import { Categoria, Precio, Propiedad } from "../models/index.js";
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
    datos: {},
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

  const {
    titulo,
    descripcion,
    categoria,
    precio,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
  } = req.body;

  const { id } = req.usuario;
  try {
    const prop = await Propiedad.create({
      titulo,
      descripcion,
      categoriaId: categoria,
      precioId: precio,
      usuarioId: "id",
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      imagen: "",
    });
    const { id } = prop;
    res.redirect(`/propiedades/agregar-imagen/${id}`)

  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardar };
