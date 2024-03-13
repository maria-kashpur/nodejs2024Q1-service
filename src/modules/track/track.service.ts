import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import appError from 'src/common/constants/errors';
import db from 'src/db';
import { EventEmitter2 } from 'eventemitter2';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    return await this.trackRepository.save(dto);
  }

  async findMany(ids: string[]): Promise<Track[]> {
    return await this.trackRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const searchTrack = await this.trackRepository.findOneBy({ id });
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

    await this.trackRepository.save(updatedTrack);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.trackRepository.delete(id)
   // await this.eventEmitter.emitAsync('remove.track', id);
  }

  // async removeArtistId(artistId: string): Promise<void> {
  //   db.tracks = db.tracks.map((track) => {
  //     if (track.artistId === artistId) {
  //       track.artistId = null;
  //     }
  //     return track;
  //   });
  // }

  // async removeAlbumId(albumId: string): Promise<void> {
  //   db.tracks = db.tracks.map((track) => {
  //     if (track.albumId === albumId) {
  //       track.albumId = null;
  //     }
  //     return track;
  //   });
  // }
}
