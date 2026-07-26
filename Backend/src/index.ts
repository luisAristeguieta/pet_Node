import express from 'express';
import cors from "cors";
import mascotasRoutes from "./routes/mascotas.js";
import { swaggerDocs } from './swagger.js';

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

app.use("/auth", mascotasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
    swaggerDocs(app, PORT);
});