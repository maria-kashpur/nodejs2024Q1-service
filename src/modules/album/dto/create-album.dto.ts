import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  grammy: boolean;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsString()
  @IsOptional()
  artistId: string | null;
}
