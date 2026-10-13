import { readdirSync, existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  const migrationsDir = 'dist/migrations';
  console.log('[migrations] cwd=', process.cwd());
  console.log('[migrations] host=', process.env.DATABASE_HOST);
  console.log('[migrations] database=', process.env.DATABASE_NAME);
  console.log('[migrations] options=', dataSource.options.migrations);
  console.log(
    '[migrations] files=',
    existsSync(migrationsDir) ? readdirSync(migrationsDir) : 'DIR MISSING',
  );

  try {
    const executed = await dataSource.runMigrations({ transaction: 'each' });
    console.log(
      '[migrations] executed=',
      executed.length === 0
        ? 'none'
        : executed.map((migration) => migration.name).join(', '),
    );
  } catch (error) {
    console.error('[migrations] failed', error);
    throw error;
  }
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
