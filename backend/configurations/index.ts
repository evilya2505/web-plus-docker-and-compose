export default function ConfigEnv() {
  return {
    port: process.env.PORT,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    expire_jwt: process.env.EXPIRE_JWT,
    secret_jwt: process.env.SECRET,
  };
}
