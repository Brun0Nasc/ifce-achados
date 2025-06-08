import "dotenv/config";
import app from "./app";
import config from "./config";
import connectDB from "./config/database";
import mongoose from "mongoose";

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      const timestamp = new Date().toLocaleString();
      console.log(`✅ ${config.appName} rodando no ambiente ${config.env}`);
      console.log(
        `🚀 Servidor iniciado às ${timestamp} na porta ${config.port}`
      );
      console.log(`🌐 Acesse em: http://localhost:${config.port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log("\n🛑 Encerrando servidor...");
      server.close(async () => {
        await mongoose.disconnect();
        console.log("✅ Conexão com o banco encerrada.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();
