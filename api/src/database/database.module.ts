import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('database');
        const usePg = !!(dbConfig.url || process.env.DB_HOST);

        if (usePg) {
          return {
            type: 'postgres' as const,
            url: dbConfig.url,
            host: dbConfig.url ? undefined : dbConfig.host,
            port: dbConfig.url ? undefined : dbConfig.port,
            username: dbConfig.url ? undefined : dbConfig.username,
            password: dbConfig.url ? undefined : dbConfig.password,
            database: dbConfig.url ? undefined : dbConfig.database,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: dbConfig.logging ?? false,
            autoLoadEntities: true,
          };
        }

        return {
          type: 'better-sqlite3' as const,
          database: process.env.SQLITE_PATH ?? './data/opentask.db',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: dbConfig.logging ?? false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
