import bcrypt from "bcryptjs";
const usuarios = [
  {
    nombre: "Gonzalo",
    email: "gonzao777info@gmail.com",
    confirmado: 1,
    password:  bcrypt.hashSync("password", 10)
  }
]

export default usuarios
