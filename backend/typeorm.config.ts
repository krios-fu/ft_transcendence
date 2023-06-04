import { DataSource } from 'typeorm';
 
export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ['dist/migrations/*.js']
});
