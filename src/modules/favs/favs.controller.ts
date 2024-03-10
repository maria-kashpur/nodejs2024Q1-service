import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { FavResponse } from './entities/fav.entity';
import appError from 'src/common/constants/errors';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('/:source/:id')
  async create(
    @Param('source') source: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Artist | Album | Track> {
    if (source === 'artist' || source === 'album' || source === 'track') {
      return await this.favsService.create(source, id);
    } else {
      throw new BadRequestException(appError.INVALID_SOURSE);
    }
  }

  @Get()
  async findAll(): Promise<FavResponse> {
    return await this.favsService.findAll();
  }

  @HttpCode(204)
  @Delete('/:source/:id')
  async remove(
    @Param('source') source: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    if (source === 'artist' || source === 'album' || source === 'track') {
      return await this.favsService.remove(source, id);
    } else {
      throw new BadRequestException(appError.INVALID_SOURSE);
    }
  }
}
