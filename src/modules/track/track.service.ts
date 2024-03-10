import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import appError from 'src/common/constants/errors';
import { v4 as uuidv4 } from 'uuid';
import db from 'src/db';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class TrackService {
  constructor(private eventEmitter: EventEmitter2) {}

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
    await this.findOne(id);
    db.tracks = db.tracks.filter((track) => track.id !== id);
    await this.eventEmitter.emitAsync('remove.track', id);
  }

  async removeArtistId(artistId: string): Promise<void> {
    db.tracks = db.tracks.map((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
      return track;
    });
  }

  async removeAlbumId(albumId: string): Promise<void> {
    db.tracks = db.tracks.map((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
      return track;
    });
  }
}
