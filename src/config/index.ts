import 'dotenv/config';

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Variável de ambiente obrigatória ${key} não definida.`);
    }
    return value;
};

const config = {
    env: getEnvVariable('NODE_ENV', 'development'),
    port: parseInt(getEnvVariable('PORT', '8080'), 10),
    appName: 'IFCE Achados',

    database: {
        mongoUri: getEnvVariable('MONGODB_URI'),
    },

    jwt: {
        secret: getEnvVariable('JWT_SECRET'),
        expiresIn: '1d',
    },

    api: {
        paginationLimit: 25,
        requestTimeout: 30000,
    },

    features: {
        enableNewUserProfile: getEnvVariable('ENABLE_NEW_PROFILE', 'false') === 'true',
    }
};

export default Object.freeze(config);