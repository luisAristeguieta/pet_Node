import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";
import type { CustomRequest } from "../middlewares/auth.middlewares.js";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const usuario = await prisma.users.findFirst({ where: { username } });

        if (!usuario) {
            res.status(401).json({ error: "Usuario no encontrado" });
            return;
        }

        const passwordCorrect = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrect) {
            res.status(401).json({ error: "Password inconrrecto" });
            return;
        }

        const token = jwt.sign(
            { id: Number(usuario.id), username },
            process.env.JWT_SECRET || "secreto",
            { expiresIn: "2h" }
        )

        res.json({ token, username: usuario.username });

    } catch (error) {

    }
}

export const obtenerPerfil = async (req: CustomRequest, res: Response) => {
    try {
        // req.usuario fue inyectado por el middleware validarAuth
        const usuarioToken = req.usuario;

        if (!usuarioToken) {
            res.status(401).json({ error: "No autorizado" });
            return;
        }

        // Buscamos la info actualizada del usuario
        const usuario = await prisma.users.findFirst({
            where: { id: BigInt(usuarioToken.id) }
        });

        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        // Formateamos la respuesta tal cual la espera tu componente Perfil.jsx
        res.json({
            message: "Bienvenido a tu panel de perfil",
            username: usuario.username,
            detected_role: usuario.rol,
            status: "Sesión Activa"
        });

    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perfil" });
    }
};