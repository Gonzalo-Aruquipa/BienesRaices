import { Precio, Categoria, Propiedad } from "../models/index.js";
const inicio =  async(req, res) => {

  const precios = await Precio.findAll({raw: true});
  const categorias = await Categoria.findAll({raw: true});
  const casas = await Propiedad.findAll({
    limit: 3,
    where:{
      categoriaId: 1
    },
    include: [{model: Precio, as :"precio"}],
    order: [["createdAt", "DESC"]]
  })
  const departamentos = await Propiedad.findAll({
    limit: 3,
    where:{
      categoriaId: 2
    },
    include: [{model: Precio, as :"precio"}],
    order: [["createdAt", "DESC"]]
  })
  
  res.render("inicio", {
    pagina: "Inicio",
    categorias,
    precios,
    casas,
    departamentos,
  });
};

const categoria = (req, res) => {};

const noEncontrado = (req, res) => {};

const buscador = (req, res) => {};

export { inicio, categoria, noEncontrado, buscador };
