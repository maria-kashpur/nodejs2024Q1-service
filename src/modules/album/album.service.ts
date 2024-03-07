import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import appError from 'src/common/constants/errors';

@Injectable()
export class AlbumService {
  alboms: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    return 'This action adds a new album';
  }

  async findAll(): Promise<Album[]> {
    return this.alboms;
  }

  async findOne(id: string): Promise<Album> {
    const searchAlbum = this.alboms.find((albom) => albom.id === id);
    if (!searchAlbum) {
      throw new NotFoundException(appError.ALBUM_ID_NOT_EXIST);
    }
    return searchAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  async remove(id: string) {
    return `This action removes a #${id} album`;
  }
}
