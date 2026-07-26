import { Router } from "express";
import multer from "multer";
import { obtenerMascotas, crearMascosta, actualizarMascosta, eliminarMascosta, obtenerFoto } from "../controllers/pet.controller.js";
import { login, obtenerPerfil } from "../controllers/auth.controllers.js";
import { validarAuth } from "../middlewares/auth.middlewares.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el Token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *       401:
 *         description: No autorizado (Token inválido o no proporcionado)
 */
router.get("/perfil", validarAuth, obtenerPerfil);

/**
 * @swagger
 * /auth/pets:
 *   get:
 *     summary: Obtener el listado de mascotas
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 *       500:
 *         description: Error al obtener mascotas
 */
router.get("/pets", validarAuth, obtenerMascotas);

/**
 * @swagger
 * /auth/pets/register:
 *   post:
 *     summary: Registrar una nueva mascota (con foto mediante Multer)
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - breed
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 example: Firulais
 *               breed:
 *                 type: string
 *                 example: Labrador
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la mascota
 *     responses:
 *       201:
 *         description: Mascota registrada exitosamente
 *       400:
 *         description: Error en los datos o archivo faltante
 *       500:
 *         description: Error al crear la mascota
 */
router.post("/pets/register", validarAuth, upload.single("file"), crearMascosta);

/**
 * @swagger
 * /auth/pets/{id}:
 *   put:
 *     summary: Actualizar información o foto de una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Nueva foto opcional
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error al actualizar la mascota
 */
router.put("/pets/:id", validarAuth, upload.single("file"), actualizarMascosta);

/**
 * @swagger
 * /auth/pets/{id}:
 *   delete:
 *     summary: Eliminar una mascota por ID
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada con éxito
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error al eliminar la mascota
 */
router.delete("/pets/:id", validarAuth, eliminarMascosta);

/**
 * @swagger
 * /auth/pets/{id}/photo:
 *   get:
 *     summary: Obtener la foto de la mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Imagen binaria retornada
 *       404:
 *         description: Foto o mascota no encontrada
 */
router.get("/pets/:id/photo", validarAuth, obtenerFoto);

export default router;