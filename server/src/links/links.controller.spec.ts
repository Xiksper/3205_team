import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { ShortenLinkDto } from './dto/shorten-link.dto';
import { HttpException } from '@nestjs/common';

describe('LinksController', () => {
  let controller: LinksController;
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: {
            shorten: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shorten', () => {
    it('should create a short URL with alias', async () => {
      const dto: ShortenLinkDto = {
        originalUrl: 'https://example.com',
        alias: 'custom123',
      };
      const expectedResult = { shortUrl: 'http://localhost:5000/custom123' };

      jest.spyOn(service, 'shorten').mockResolvedValue(expectedResult);

      const result = await controller.shorten(dto);
      expect(result).toEqual(expectedResult);
      expect(service.shorten).toHaveBeenCalledWith(dto);
    });

    it('should create a short URL without alias', async () => {
      const dto: ShortenLinkDto = { originalUrl: 'https://example.com' };
      const expectedResult = { shortUrl: 'http://localhost:5000/random' };

      jest.spyOn(service, 'shorten').mockResolvedValue(expectedResult);

      const result = await controller.shorten(dto);
      expect(result).toEqual(expectedResult);
      expect(service.shorten).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if alias is already taken', async () => {
      const dto: ShortenLinkDto = {
        originalUrl: 'https://example.com',
        alias: 'custom123',
      };

      jest.spyOn(service, 'shorten').mockRejectedValue(
        new HttpException('This alias is already in use. Please choose another one.', 400)
      );

      await expect(controller.shorten(dto)).rejects.toThrow(HttpException);
    });
  });
});
