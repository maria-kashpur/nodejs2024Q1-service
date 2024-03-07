import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import appError from 'src/common/constants/errors';

@Injectable()
export class TrackService {
  tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    return 'This action adds a new track';
  }

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findOne(id: string): Promise<Track> {
    const searchTrack = this.tracks.find((track) => track.id === id);
    if (!searchTrack) {
      throw new NotFoundException(appError.TRACK_ID_NOT_EXIST);
    }
    return searchTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  async remove(id: string) {
    return `This action removes a #${id} track`;
  }
}
