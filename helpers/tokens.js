import Jwt  from "jsonwebtoken";
const generarId = () => {
    return Math.random().toString(32).substring(2) + Date.now().toString(32);
}

const generarToken = id => Jwt.sign({id}, "jwt",{expiresIn: "1d"})


export {
  generarId,
  generarToken,
} 
