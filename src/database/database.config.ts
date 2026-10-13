import { existsSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const nodeEnv = process.env.NODE_ENV || 'development';
const envCandidates = [`.env.${nodeEnv}`, '.env'];

for (const filename of envCandidates) {
  const fullPath = resolve(process.cwd(), filename);
  if (existsSync(fullPath)) {
    config({ path: fullPath, override: false });
  }
}

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  schema: 'public',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'dieta',
  password: process.env.DATABASE_PASSWORD || 'dieta',
  database: process.env.DATABASE_NAME || 'dieta',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  migrationsTransactionMode: 'each',
  synchronize: false,
  logging: ['error', 'warn', 'info', 'migration', 'schema'],
};

export default new DataSource(databaseConfig);
