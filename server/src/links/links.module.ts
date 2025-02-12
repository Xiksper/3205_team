import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Visit } from './entities/visit.entity';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Visit])],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [TypeOrmModule],
})
export class LinksModule {}
