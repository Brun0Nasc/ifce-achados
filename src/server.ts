import 'dotenv/config';
import app from './app';
import config from './config';
import connectDB from './config/database';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`${config.appName} rodando no ambiente ${config.env} na porta ${config.port}`);
      console.log(`Acesse em: http://localhost:${config.port}`);
    });

  } catch (error) {
    console.error("Falha ao iniciar o servidor.", error);
    process.exit(1);
  }
};

startServer();