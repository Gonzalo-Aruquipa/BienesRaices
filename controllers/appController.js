import { Sequelize } from "sequelize";
import { Precio, Categoria, Propiedad } from "../models/index.js";
const inicio = async (req, res) => {
  const precios = await Precio.findAll({ raw: true });
  const categorias = await Categoria.findAll({ raw: true });
  const casas = await Propiedad.findAll({
    limit: 3,
    where: {
      categoriaId: 1,
    },
    include: [{ model: Precio, as: "precio" }],
    order: [["createdAt", "DESC"]],
  });
  const departamentos = await Propiedad.findAll({
    limit: 3,
    where: {
      categoriaId: 2,
    },
    include: [{ model: Precio, as: "precio" }],
    order: [["createdAt", "DESC"]],
  });

  res.render("inicio", {
    pagina: "Inicio",
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    casas,
    departamentos,
  });
};

const categoria = async (req, res) => {
  const { id } = req.params;

  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }

  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id,
    },
    include: [{ model: Precio, as: "precio" }],
  });

  res.render("categoria", {
    pagina: `${categoria.nombre}s en Venta`,
    propiedades,
    csrfToken: req.csrfToken(),
  });
};

const noEncontrado = (req, res) => {
  res.render("404", {
    pagina: "No Encontrado",
    csrfToken: req.csrfToken(),
  });
};

const buscador = async (req, res) => {
  const { termino } = req.body;
  if (!termino.trim()) {
    res.redirect("back");
  }

  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Sequelize.Op.like]: "%" + termino + "%",
      },
    },
    include: [{ model: Precio, as: "precio" }],
  });

  res.render("busqueda", {
    pagina: "Resultados de la Búsqueda",
    csrfToken: req.csrfToken(),
    propiedades,
  });
};

export { inicio, categoria, noEncontrado, buscador };
