import { Router } from "express";
import { admin } from "../controllers/propiedadesController.js";

const router = Router();

router.get("/mis-propiedades", admin )

export default router
