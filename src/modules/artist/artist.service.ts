import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import appError from 'src/common/constants/errors';

@Injectable()
export class ArtistService {
  artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    return 'This action adds a new artist';
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

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  async remove(id: string) {
    return `This action removes a #${id} artist`;
  }
}
