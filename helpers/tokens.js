import jwt from "jsonwebtoken";
const generarId = () => {
  return Math.random().toString(32).substring(2) + Date.now().toString(32);
};

const generarToken = (datos) =>
  jwt.sign({ id: datos.id, nombre: datos.nombre }, "jwt", { expiresIn: "1d" });

export { generarId, generarToken };
