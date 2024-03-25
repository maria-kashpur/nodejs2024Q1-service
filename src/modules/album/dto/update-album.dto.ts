import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
