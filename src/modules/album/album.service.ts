import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';

@Injectable()
export class AlbumService {
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    }; 

    db.albums.push(album);

    return album;
  }

  async findAll(): Promise<Album[]> {
    return db.albums;
  }

  async findMany(ids: string[]): Promise<Album[]> {
    return db.albums.filter((album) => ids.includes(album.id));
  }

  async findOne(id: string): Promise<Album> {
    const searchAlbum = db.albums.find((albom) => albom.id === id);
    if (!searchAlbum) {
      throw new NotFoundException(appError.ALBUM_ID_NOT_EXIST);
    }
    return searchAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    const updatedAlbum: Album = {
      ...album,
      ...updateAlbumDto,
    };
    db.albums = db.albums.map((album) =>
      album.id === id ? updatedAlbum : album,
    );
    return updatedAlbum;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    db.albums = db.albums.filter((album) => album.id !== id);
  }
}
