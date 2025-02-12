import { IsOptional, IsString, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';

export class ShortenLinkDto {
  @IsString()
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  @IsNotEmpty({ message: 'originalUrl is required' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'alias must not exceed 20 characters' })
  alias?: string;
}
