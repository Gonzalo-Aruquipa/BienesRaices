import { validationResult } from "express-validator";
import {unlink} from "node:fs/promises"
import { Categoria, Precio, Propiedad } from "../models/index.js";
const admin = async (req, res) => {
  const { id } = req.usuario;
  const propiedades = await Propiedad.findAll({
    where: { usuarioId: id },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });

  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    csrfToken: req.csrfToken(),
    propiedades,
  });
};

const crear = async (req, res) => {
  const categorias = await Categoria.findAll();
  const precios = await Precio.findAll();

  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
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

  const { id: usuarioId } = req.usuario;

  try {
    const prop = await Propiedad.create({
      titulo,
      descripcion,
      categoriaId: categoria,
      precioId: precio,
      usuarioId,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      imagen: "",
    });
    const { id } = prop;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  const prop = await Propiedad.findByPk(id);

  if (!prop) {
    return res.redirect("/mis-propiedades");
  }
  if (prop.publicado) {
    return res.redirect("/mis-propiedades");
  }

  if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen: ${prop.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad: prop,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  const prop = await Propiedad.findByPk(id);

  if (!prop) {
    return res.redirect("/mis-propiedades");
  }
  if (prop.publicado) {
    return res.redirect("/mis-propiedades");
  }

  if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  try {
    prop.imagen = req.file.filename;
    prop.publicado = 1;

    await prop.save();
    next();
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  if (propiedad.usuarioId.toString !== req.usuario.id.toString) {
    return res.redirect("/mis-propiedades");
  }
  const categorias = await Categoria.findAll();
  const precios = await Precio.findAll();

  res.render("propiedades/editar", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias: categorias,
    precios: precios,
    datos: propiedad,
  });
};
const guardarCambios = async (req, res) => {
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const categorias = await Categoria.findAll();
    const precios = await Precio.findAll();
    return res.render("propiedades/editar", {
      pagina: `Editar Propiedad`,
      csrfToken: req.csrfToken(),
      errores: result.array(),
      categorias: categorias,
      precios: precios,
      datos: req.body,
    });
  }

  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  if (propiedad.usuarioId.toString !== req.usuario.id.toString) {
    return res.redirect("/mis-propiedades");
  }

  try {
    const {
      titulo,
      descripcion,
      categoria: categoriaId,
      precio: precioId,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
    } = req.body;
    propiedad.set({
      titulo,
      descripcion,
      categoriaId,
      precioId,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
    });
    await propiedad.save();
    res.redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};
const eliminar = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  await unlink(`public/uploads/${propiedad.imagen}`)
  await propiedad.destroy()
  res.redirect("/mis-propiedades")
};

const mostrarPropiedad = async(req, res) => {

  const {id} = req.params


  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  if(!propiedad){
    return res.redirect("/404")
  }
  res.render("propiedades/mostrar", {
    propiedad,
    pagina: propiedad.titulo,


  })
}

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
};
