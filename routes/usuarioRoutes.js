import { Router } from "express";
import { formularioLogin, formularioRegistro } from "../controllers/Usuario.js";

const router = Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);

export default router;
