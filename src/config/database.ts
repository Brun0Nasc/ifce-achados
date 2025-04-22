import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);

        await mongoose.connect(config.database.mongoUri);

        console.log('MongoDB Conectado com Sucesso!');

        mongoose.connection.on('error', (err) => {
            console.error(`Erro na conexão MongoDB: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB desconectado.');
        });

    } catch (error) {
        console.error('Falha ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;