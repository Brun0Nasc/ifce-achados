import 'dotenv/config';

const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Variável de ambiente obrigatória ${key} não definida.`);
    }
    return value;
};

function getEnvNumberOrString(key: string, defaultValue: string): string | number {
  const value = process.env[key] ?? defaultValue;
  return /^[0-9]+$/.test(value) ? parseInt(value, 10) : value;
}


const config = {
    env: getEnvVariable('NODE_ENV', 'development'),
    port: parseInt(getEnvVariable('PORT', '8080'), 10),
    appName: 'IFCE Achados',
    baseUrl: getEnvVariable('URL_BASE'),

    database: {
        mongoUri: getEnvVariable('MONGODB_URI'),
    },

    jwt: {
        secret: getEnvVariable('JWT_SECRET'),
        expiresIn: getEnvNumberOrString('JWT_EXPIRES_IN', '1d') as string,
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