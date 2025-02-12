import { Body, Controller, Delete, Get, Param, Post, NotFoundException, Res, Req, GoneException } from '@nestjs/common';
import { LinksService } from './links.service';
import { ShortenLinkDto } from './dto/shorten-link.dto';
import { Response, Request } from 'express';

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('shorten')
  async shorten(@Body() shortenLinkDto: ShortenLinkDto) {
    return await this.linksService.shorten(shortenLinkDto);
  }

  @Get('getLinks')
  async getLinks(){
    return await this.linksService.getLinks();
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response, @Req() req: Request) {
    const originalUrl = await this.linksService.getOriginalUrl(shortUrl);
    const expiresAt = await this.linksService.getExpiresAt(shortUrl);
  
    if (!originalUrl) {
      throw new NotFoundException('Short URL not found');
    }
  
    // Проверяем, не истек ли срок действия ссылки
    if (expiresAt && new Date() > expiresAt) {
      throw new GoneException('Short URL has expired');
    }
  
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await this.linksService.recordVisit(shortUrl, clientIp);
    
    return res.redirect(originalUrl);
  }

  @Get('info/:shortUrl')
  async getLinkInfo(@Param('shortUrl') shortUrl: string) {
    const linkInfo = await this.linksService.getLinkInfo(shortUrl);
    if (!linkInfo) {
      throw new NotFoundException('Short URL not found');
    }
    return linkInfo;
  }

  @Delete('delete/:shortUrl')
  async deleteLink(@Param('shortUrl') shortUrl: string) {
    const deleted = await this.linksService.deleteLink(shortUrl);
    if (!deleted) {
      throw new NotFoundException('Short URL not found');
    }
    return { message: 'Short URL deleted successfully' };
  }

  @Get('analytics/:shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return await this.linksService.getAnalytics(shortUrl);
  }
}
