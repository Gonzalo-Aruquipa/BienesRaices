import { validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import {
  Categoria,
  Precio,
  Propiedad,
  Mensaje,
  Usuario,
} from "../models/index.js";
import { esVendedor, formatearFecha } from "../helpers/index.js";
const admin = async (req, res) => {
  const { pagina: paginaActual } = req.query;

  const expresion = /^[0-9]$/;

  if (!expresion.test(paginaActual)) {
    return res.redirect("/mis-propiedades?pagina=1");
  }

  try {
    const { id } = req.usuario;

    const limit = 10;
    const offset = paginaActual * limit - limit;
    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: { usuarioId: id },
        include: [
          { model: Categoria, as: "categoria" },
          { model: Precio, as: "precio" },
          { model: Mensaje, as: "mensajes" },
        ],
      }),
      Propiedad.count({
        where: {
          usuarioId: id,
        },
      }),
    ]);

    res.render("propiedades/admin", {
      pagina: "Mis Propiedades",
      csrfToken: req.csrfToken(),
      propiedades,
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
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

  await unlink(`public/uploads/${propiedad.imagen}`);
  await propiedad.destroy();
  res.redirect("/mis-propiedades");
};

const mostrarPropiedad = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  if (!propiedad) {
    return res.redirect("/404");
  }

  res.render("propiedades/mostrar", {
    propiedad,
    csrfToken: req.csrfToken(),
    pagina: propiedad.titulo,
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
  });
};

const enviarMensaje = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  if (!propiedad) {
    return res.redirect("/404");
  }

  let result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("propiedades/mostrar", {
      propiedad,
      csrfToken: req.csrfToken(),
      pagina: propiedad.titulo,
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
      errores: result.array(),
    });
  }

  const { mensaje } = req.body;
  const { id: propiedadId } = req.params;
  const { id: usuarioId } = req.usuario;
  await Mensaje.create({
    mensaje,
    propiedadId,
    usuarioId,
  });

  res.redirect("/");
};

const verMensajes = async (req, res) => {
  const { id } = req.params;

  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensaje,
        as: "mensajes",
        include: [{ model: Usuario.scope("eliminarAt"), as: "usuario" }],
      },
    ],
  });

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }
  res.render("propiedades/mensajes", {
    pagina: "Mensajes",
    mensajes: propiedad.mensajes,
    formatearFecha
  });
};
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
  enviarMensaje,
  verMensajes,
};
