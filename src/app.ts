import express, { Express, Request, Response, NextFunction } from "express";
import authRoutes from "./api/auth.routes";
import userRoutes from "./api/users.routes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Olá, Mundo!" });
});

export default app;
