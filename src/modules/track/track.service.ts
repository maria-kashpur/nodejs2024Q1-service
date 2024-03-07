import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    // validate createTrackDto
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.push(track);
    return track;
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

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);
    const updatedTrack: Track = {
      ...track,
      ...updateTrackDto,
    }

    this.tracks = this.tracks.map(track => track.id === id ? updatedTrack: track)

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const track = this.findOne(id);
    this.tracks = this.tracks.filter((track) => track.id !== id)
  }
}
