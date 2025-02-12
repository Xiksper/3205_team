import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LinksModule } from './links/links.module';
import { Link } from './links/entities/link.entity';
import { Visit } from './links/entities/visit.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '12345',
      database: process.env.DB_NAME || 'team_3205',
      entities: [Link, Visit],
      autoLoadEntities: true,
      synchronize: true,
    }),
    LinksModule,
  ],
})
export class AppModule {}
