import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH', 'database.sqlite'),
        entities: [User, Report],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
        migrationsRun: configService.get<string>('NODE_ENV') !== 'development',
        migrations: ['dist/database/migrations/*.js'],
        migrationsTableName: 'migrations',
        dropSchema: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
