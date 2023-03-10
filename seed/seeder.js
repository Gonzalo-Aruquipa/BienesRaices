import categorias from "./categorias.js";
import Categoria from "../models/Categoria.js";
import precios from "./precios.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    await db.authenticate();
    await db.sync();
    await Categoria.bulkCreate(categorias);
    await Precio.bulkCreate(precios)
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const eliminarDatos =async()=> {

  try {
    // await Categoria.destroy({where:{}, truncate: true});
    // await Precio.destroy({where:{}, truncate: true})
    await db.sync({force: true})
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
} 

if(process.argv[2] === "-i"){
  importarDatos()
}

if(process.argv[2] === "-e"){
  eliminarDatos()
}

