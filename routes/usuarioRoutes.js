import { Router } from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, recuperarPassword, resetPassword, comprobarToken, nuevoPassword} from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);
router.post("/registro", registrar);
router.get("/confirma/:token", confirmar);
router.get("/registro", formularioRegistro);
router.get("/recuperar-password", recuperarPassword);
router.post("/reset", resetPassword);
router.get("/recuperar-password/:token", comprobarToken);
router.post("/recuperar-password/:token", nuevoPassword);

export default router;
