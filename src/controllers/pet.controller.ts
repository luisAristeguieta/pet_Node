import { type Request, type Response } from "express"; 
import prisma from "../database/prisma.js";


export const obtenerMascotas = async (req: Request, res: Response) => {

    try {
        const mascotas = await prisma.pets.findMany({
            select: {
                id: true,
                breed: true,
                mime_type: true,
                name: true,
            }
        })

        const mascotasFormateadas = mascotas.map(mascota => ({ // Para que desea dar formarto? que pasa si le envio mascostas en el json? 
            id: mascota.id,
            breed: mascota.breed,
            mimeType: mascota.mime_type,
            name: mascota.name
        }));

        res.status(200).json(mascotasFormateadas);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener mascotas" });
    }
}

export const crearMascosta = async (req: Request, res: Response) => {

    const { breed, name } = req.body;
    const archivo = req.file;

    if (!archivo) {
        res.status(400).json({ error: "Error al obtener archivo" });
        return;
    }

    try {
        const nuevaMascota = await prisma.pets.create({
            data: {
                breed,
                mime_type: archivo.mimetype,
                name,
                photo: new Uint8Array(archivo.buffer)
            }
        });
        res.status(201).json({ nuevaMascota });
    }
    catch (error) {
        res.status(500).json({ error: "Error al crear mascota" });
    }
}


export const actualizarMascosta = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { breed, name } = req.body;
    const archivo = req.file;

    const buscarMascota = await prisma.pets.findUnique({ where: { id: Number(id) } });

    if (!buscarMascota) {
        res.status(404).json({ error: `Mascota con ${id} no encontrada` });
        return;
    }

    let mimetypeObtenida = buscarMascota.mime_type;
    let fotoObtenida = buscarMascota.photo;


    if (archivo) {
        mimetypeObtenida = archivo.mimetype;
        fotoObtenida = new Uint8Array(archivo.buffer);
    }

    try {
        const mascotaActualizada = await prisma.pets.update({
            where: { id: Number(id) },
            data: {
                breed: breed || buscarMascota.breed,
                name: name || buscarMascota.name,
                mime_type: mimetypeObtenida,
                photo: fotoObtenida
            }
        })

        res.status(200).json(mascotaActualizada);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar mascota" });
    }
}

export const eliminarMascosta = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.pets.delete({ where: { id: Number(id) } });
        res.status(200).json({ mensaje: "Mascota eliminada exitosamente" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar mascota" });
    }
}

export const obtenerFoto = async (req: Request, res: Response) => {

    const { id } = req.params; 

    try {
        const mascota = await prisma.pets.findUnique({ where: { id: Number(id) } });

        if (!mascota || !mascota.photo) {
            res.status(404).json({ error: "Mascota o foto no encontrada" });
            return;
        }

        res.setHeader("Content-Type", mascota.mime_type || "image/jpeg");
        res.end(Buffer.from(mascota.photo));
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar mascota" });
    }
}