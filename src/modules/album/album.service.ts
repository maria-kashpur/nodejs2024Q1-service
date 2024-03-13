import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';
import { EventEmitter2 } from 'eventemitter2';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    return await this.albumRepository.save(dto);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find()
  }

  async findMany(ids: string[]): Promise<Album[]> {
    return await this.albumRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: string): Promise<Album> {
    const searchAlbum = await this.albumRepository.findOneBy({ id });;
    if (!searchAlbum) {
      throw new NotFoundException(appError.ALBUM_ID_NOT_EXIST);
    }
    return searchAlbum;
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    const updatedAlbum: Album = {
      ...album,
      ...dto,
    };
    
    await this.albumRepository.save(updatedAlbum);

    return await this.findOne(id);;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.albumRepository.delete(id)
    // await this.eventEmitter.emitAsync('remove.album', id);
  }

  // async removeArtistId(artistId: string): Promise<void> {
  //   db.albums = db.albums.map((album) => {
  //     if (album.artistId === artistId) {
  //       album.artistId = null;
  //     }
  //     return album;
  //   });
  // }
}
