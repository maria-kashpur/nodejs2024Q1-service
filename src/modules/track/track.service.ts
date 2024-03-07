import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';

@Injectable()
export class TrackService {
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    db.tracks.push(track);
    return track;
  }

  async findMany(ids: string[]): Promise<Track[]> {
    return db.tracks.filter((track) => ids.includes(track.id));
  }

  async findAll(): Promise<Track[]> {
    return db.tracks;
  }

  async findOne(id: string): Promise<Track> {
    const searchTrack = db.tracks.find((track) => track.id === id);
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
    };

    db.tracks = db.tracks.map((track) =>
      track.id === id ? updatedTrack : track,
    );

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);
    db.tracks = db.tracks.filter((track) => track.id !== id);
  }
}
