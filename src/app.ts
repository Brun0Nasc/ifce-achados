import express, { Express, Request, Response, NextFunction } from 'express';
import authRoutes from './api/auth.routes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Olá, Mundo!' });
});

export default app;