import { Router } from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, recuperarPassword } from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);
router.post("/registro", registrar);
router.get("/confirma/:token", confirmar);
router.get("/registro", formularioRegistro);
router.get("/recuperar-password", recuperarPassword);

export default router;
