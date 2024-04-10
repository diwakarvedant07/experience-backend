const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    user: process.env.MS_EMP_PER_SQL_LIVE_RW_USER,
    password: process.env.MS_EMP_PER_SQL_LIVE_RW_PWD,
    server: process.env.MS_EMP_PER_SQL_LIVE_RW_SERVER,
    database: process.env.MS_EMP_PER_SQL_LIVE_RW_DB,
    options: {
    encrypt: false,
    trustServerCertificate: true, // Trust the self-signed certificate
    port: Number(process.env.MS_EMP_PER_SQL_LIVE_RW_PORT)
    },
};