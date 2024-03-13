import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import appError from 'src/common/constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    return await this.artistRepository.save(dto);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findMany(ids: string[]): Promise<Artist[]> {
    return await this.artistRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: string): Promise<Artist> {
    const searchArtist = await this.artistRepository.findOneBy({ id });
    if (!searchArtist) {
      throw new NotFoundException(appError.ARTIST_ID_NOT_EXIST);
    }
    return searchArtist;
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    const updatedArtist: Artist = {
      ...artist,
      ...dto,
    };

    await this.artistRepository.save(updatedArtist);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.artistRepository.delete(id);
    //await this.eventEmitter.emitAsync('remove.artist', id);
  }
}
