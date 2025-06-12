// src/app.ts
import express, { Express, Request, Response, NextFunction } from "express";
import authRoutes from "./api/auth.routes";
import userRoutes from "./api/users.routes";
import cors from "cors";
import helmet from "helmet";
import itemRoutes from "./api/item.routes";

const app: Express = express();


app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/items", itemRoutes);


app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Rota raiz
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Olá, Mundo!" });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERRO GLOBAL]", err);

  res.status(err.status || 500).json({
    message: err.message || "Erro interno no servidor.",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;
