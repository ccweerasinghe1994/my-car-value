import { DataSource } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'database.sqlite',
  entities: [User, Report],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: process.env.NODE_ENV !== 'development',
  migrationsTableName: 'migrations',
  dropSchema: false,
});
