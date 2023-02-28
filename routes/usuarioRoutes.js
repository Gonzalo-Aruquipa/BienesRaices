import { Router } from "express";
import { formularioLogin, formularioRegistro, registrar, recuperarPassword } from "../controllers/usuarioController.js";

const router = Router();

router.get("/login", formularioLogin);
router.post("/registro", registrar);
router.get("/registro", formularioRegistro);
router.get("/recuperar-password", recuperarPassword);

export default router;
