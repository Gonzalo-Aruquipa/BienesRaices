import express from "express";
import db from "./config/db.js";
import usuarioRoutes  from "./routes/usuarioRoutes.js"


const app = express();

try {
  await db.authenticate();
  console.log("conection db")
  
} catch (error) {
  console.log(error)
}
app.set("view engine", "pug")
app.set("views", "./views")

app.use(express.static("public"))

app.use("/auth",usuarioRoutes);


const port = 3000;
app.listen(port, ()=>{
  console.log(`listening on port ${port}`)
})
