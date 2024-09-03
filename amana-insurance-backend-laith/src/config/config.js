import dotenv from 'dotenv';

dotenv.config();

export default {
    development: {
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        dialect: process.env.DEV_DB_DIALECT,
        logging: process.env.DEV_DB_LOGGING,
        migrationStorageTableName: "migrations"
    },
    test: {
        username: process.env.TEST_TEST_DB_USERNAME,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        dialect: process.env.TEST_DB_DIALECT,
        logging: process.env.TEST_DB_LOGGING,
        migrationStorageTableName: "migrations"
    },
    production: {
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_DATABASE,
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        dialect: process.env.PROD_DB_DIALECT,
        logging: process.env.PROD_DB_LOGGING,
        migrationStorageTableName: "migrations"
    }
}