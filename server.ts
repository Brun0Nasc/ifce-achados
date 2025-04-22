import 'dotenv/config';
import app from './src/app';
import config from './src/config';
import connectDB from './src/config/database';

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