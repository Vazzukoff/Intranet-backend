import express from 'express';
import authRoutes from './routes/auth.routes';
import { corsMiddleware } from './middlewares/cors.middleware';
import tasksRoutes from './routes/tasks.routes';
import { requireAuth } from './middlewares/auth.middleware';
import userRoutes from './routes/user.routes';
import cookieParser from "cookie-parser";
import uploadRoutes from './routes/upload.routes';
import filesRoutes from './routes/files.routes';
import path from 'path';
import listEndpoints from 'express-list-endpoints';

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(corsMiddleware);

// Rutas públicas (sin autenticación)
app.use("/api/auth", authRoutes);

// Rutas protegidas (con autenticación)
app.use("/api/tasks", requireAuth, tasksRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/files", requireAuth, filesRoutes);
app.use("/api/upload", requireAuth, uploadRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, '/uploads')));

console.log("🛣️ Rutas registradas en Express:");
console.log(listEndpoints(app));

export default app;