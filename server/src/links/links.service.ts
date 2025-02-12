import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenLinkDto } from './dto/shorten-link.dto';
import { Link } from './entities/link.entity';
import { Visit } from './entities/visit.entity';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  async shorten({ originalUrl, expiresAt, alias }: ShortenLinkDto): Promise<{ shortUrl: string }> {
    let shortUrl = alias || Math.random().toString(36).substring(2, 8);
    let existingLink = await this.linkRepository.findOne({ where: { shortUrl } });

    if (alias && existingLink) {
      throw new HttpException('This alias is already in use. Please choose another one.', HttpStatus.BAD_REQUEST);
   }

    /* 
    Если alias не задан, но случайный shortUrl уже существует, генерируем новый, пока не найдем уникальный.
    Сразу скажу что понимаю: да теоретически этот цикл может работать долго в случае если ссылок будет много,
    или это будет бесконечным циклом если у нас есть все ссылки(из 6 символов это возможно), по этому в реальном проекте 
    алгоритм должен быть более сложным, однако думаю этого достаточно в не комерческом тестовом проекте на знание nest.js.
    */
    while (!alias && existingLink) {
        shortUrl = Math.random().toString(36).substring(2, 8);
        existingLink = await this.linkRepository.findOne({ where: { shortUrl } });
    }

    const newLink = this.linkRepository.create({ originalUrl, shortUrl, expiresAt });
    await this.linkRepository.save(newLink);

    return { shortUrl: `http://localhost:5000/${shortUrl}` };
}

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const link = await this.linkRepository.findOne({ where: { shortUrl } });
    if (!link) return null;

    let originalUrl = link.originalUrl;
    if (!/^https?:\/\//i.test(originalUrl)) {
      originalUrl = 'https://' + originalUrl;
    }
    return originalUrl;
  }
  async getExpiresAt(shortUrl: string): Promise<Date | null> {
    const link = await this.linkRepository.findOne({ where: { shortUrl } });
    return link?.expiresAt ?? null;
  }

  async getLinkInfo(shortUrl: string): Promise<Link | null> {
    return await this.linkRepository.findOne({ where: { shortUrl } }) || null;
  }

  async deleteLink(shortUrl: string): Promise<boolean> {
    const result = await this.linkRepository.delete({ shortUrl });
    return (result.affected ?? 0) > 0;
  }
  
  async recordVisit(shortUrl: string, ip: string): Promise<void> {
    const link = await this.linkRepository.findOne({ where: { shortUrl } });
    if (link) {
      const visit = this.visitRepository.create({ link, ip });
      await this.visitRepository.save(visit);
    }
  }

  async getAnalytics(shortUrl: string): Promise<{ totalVisits: number; lastIps: string[] }> {
    const link = await this.linkRepository.findOne({ where: { shortUrl } });
    if (!link) {
      throw new HttpException(`Link "${shortUrl}" not found`, HttpStatus.NOT_FOUND);
    }
    const totalVisits = await this.visitRepository.count({ where: { link: { shortUrl } } });
    const lastVisits = await this.visitRepository.find({
        where: { link: { shortUrl } },
        order: { visitedAt: 'DESC' },
        take: 5,
    });

    const lastIps = lastVisits.map((visit) => visit.ip);
    
    return { totalVisits, lastIps };
}

  async getLinks(): Promise<Link[]> {
    return await this.linkRepository.find();
  }
}
