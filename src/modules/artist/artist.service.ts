import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  artists: Artist[] = [];

  async create(createArtistDto: CreateArtistDto): Promise<Artist>  {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto
    };
    this.artists.push(artist)
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return this.artists;
  }

  async findOne(id: string): Promise<Artist> {
    const searchArtist = this.artists.find((artist) => artist.id === id);
    if (!searchArtist) {
      throw new NotFoundException(appError.ARTIST_ID_NOT_EXIST);
    }
    return searchArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id)
    const updatedArtist = {
      ...artist,
      updateArtistDto
    }

    this.artists = this.artists.map(artist => artist.id === id ? updatedArtist : artist);

    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);
    this.artists = this.artists.filter((artist) => artist.id !== id)
  }
}
