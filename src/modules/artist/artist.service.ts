import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    db.artists.push(artist);
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return db.artists;
  }

  async findMany(ids: string[]): Promise<Artist[]> {
    return db.artists.filter((artist) => ids.includes(artist.id));
  }

  async findOne(id: string): Promise<Artist> {
    const searchArtist = db.artists.find((artist) => artist.id === id);
    if (!searchArtist) {
      throw new NotFoundException(appError.ARTIST_ID_NOT_EXIST);
    }
    return searchArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    const updatedArtist: Artist = {
      ...artist,
      ...updateArtistDto,
    };

    db.artists = db.artists.map((artist) =>
      artist.id === id ? updatedArtist : artist,
    );

    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    db.artists = db.artists.filter((artist) => artist.id !== id);
    await this.removeFavorites(id);
  }

  async removeFavorites(id: string): Promise<void> {
    const artistIndex = db.favs.artistIds.indexOf(id);
    if (artistIndex === -1) {
      throw new BadRequestException(appError.NOT_FOUND_FAVS_ARTIST);
    }
    db.favs.artistIds.splice(artistIndex, 1);
  }
}
