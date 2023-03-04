import { Router } from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, recuperarPassword, resetPassword, comprobarToken, nuevoPassword, autenticar} from "../controllers/usuarioController.js";

const router = Router();

router.post("/registro", registrar);
router.get("/confirma/:token", confirmar);
router.get("/registro", formularioRegistro);
router.get("/recuperar-password", recuperarPassword);
router.post("/reset", resetPassword);
router.get("/recuperar-password/:token", comprobarToken);
router.post("/recuperar-password/:token", nuevoPassword);

router.get("/login", formularioLogin);
router.post("/login", autenticar);


export default router;
