import { Router } from "express";
import { formularioLogin, formularioRegistro, recuperarPassword } from "../controllers/Usuario.js";

const router = Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/recuperar-password", recuperarPassword);

export default router;
