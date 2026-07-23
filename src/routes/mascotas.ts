import { Router } from "express";
import multer from "multer";
import {obtenerMascotas, crearMascosta, actualizarMascosta, eliminarMascosta, obtenerFoto} from "../controllers/pet.controller.js"
import { login,obtenerPerfil } from "../controllers/auth.controllers.js";
import { validarAuth } from "../middlewares/auth.middlewares.js";


const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Rutas de autenticación: 
router.post("/login", login);
router.get("/perfil", validarAuth, obtenerPerfil);

// Rutas de mascotas: 
router.get("/pets", validarAuth,obtenerMascotas);
router.post("/pets/register", validarAuth, upload.single("file"), crearMascosta);
router.put("/pets/:id", validarAuth, upload.single("file"), actualizarMascosta);
router.delete("/pets/:id", validarAuth, eliminarMascosta);
router.get("/pets/:id/photo", validarAuth, obtenerFoto);

export default router;