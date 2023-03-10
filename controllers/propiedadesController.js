import Categoria from "../models/Categoria.js"
import Precio from "../models/Precio.js";
const admin = (req, res)=> {
res.render("propiedades/admin", {
  pagina: "Mis Propiedades",
  barra: true
})
}

const crear = async(req, res) => {

  const categorias = await Categoria.findAll();
  const precios = await Precio.findAll();

  console.log(categorias)
  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    categorias: categorias,
    precios: precios
  })
}

export {
  admin, crear
}
