import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import db from "./config/db.js";
import bodyParser from "body-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

try {
  await db.authenticate();
  db.sync();
  console.log("conection db successfully");
} catch (error) {
  console.log(error);
}
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
