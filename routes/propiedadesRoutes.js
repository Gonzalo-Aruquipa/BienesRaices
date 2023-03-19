import { Router } from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadesController.js";
import protegerRuta from "../middleware/protegerRuta.js";

const router = Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear",  crear);
router.post(
  "/propiedades/crear",
  
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción no puede ir vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isNumeric().withMessage("Selecciona un precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona la cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),

  guardar
);

export default router;
