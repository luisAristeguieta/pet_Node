import { Router } from "express";
import multer from "multer";
import {obtenerMascotas, crearMascosta, actualizarMascosta, eliminarMascosta, obtenerFoto} from "../controllers/pet.controller.js"

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/pets", obtenerMascotas);
router.post("/pets/register", upload.single("file"), crearMascosta);
router.put("/pets/:id", upload.single("file"), actualizarMascosta);
router.delete("/pets/:id", eliminarMascosta);
router.get("/pets/:id/photo", obtenerFoto);

export default router;