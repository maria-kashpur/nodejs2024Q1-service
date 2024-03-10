import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavResponse } from './entities/fav.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import appError from 'src/common/constants/errors';
import db from 'src/db';

@Injectable()
export class FavsService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async addArtist(id: string): Promise<Artist> {
    const { artistIds } = db.favs;
    let artist: Artist;

    try {
      artist = await this.artistService.findOne(id);
    } catch (e) {
      throw new UnprocessableEntityException(appError.ARTIST_ID_NOT_EXIST);
    }

    if (!artistIds.includes(id)) {
      artistIds.push(id);
    }
    return artist;
  }

  async addAlbum(id: string): Promise<Album> {
    const { albumIds } = db.favs;
    let album: Album;

    try {
      album = await this.albumService.findOne(id);
    } catch (e) {
      throw new UnprocessableEntityException(appError.ALBUM_ID_NOT_EXIST);
    }

    if (!albumIds.includes(id)) {
      albumIds.push(id);
    }
    return album;
  }

  async addTrack(id: string): Promise<Track> {
    const { trackIds } = db.favs;
    let track: Track;

    try {
      track = await this.trackService.findOne(id);
    } catch (e) {
      throw new UnprocessableEntityException(appError.TRACK_ID_NOT_EXIST);
    }

    if (!trackIds.includes(id)) {
      trackIds.push(id);
    }
    return track;
  }

  async create(
    source: 'artist' | 'album' | 'track',
    id: string,
  ): Promise<Artist | Album | Track> {
    switch (source) {
      case 'artist':
        return await this.addArtist(id);

      case 'album':
        return await this.addAlbum(id);

      case 'track':
        return await this.addTrack(id);

      default:
        throw new Error('Invalid source');
    }
  }

  async findAll(): Promise<FavResponse> {
    const { artistIds, albumIds, trackIds } = db.favs;
    const response: FavResponse = {
      artists: await this.artistService.findMany(artistIds),
      albums: await this.albumService.findMany(albumIds),
      tracks: await this.trackService.findMany(trackIds),
    };
    return response;
  }

  private async removeArtist(id: string) {
    const artistIndex = db.favs.artistIds.indexOf(id);
    if (artistIndex === -1) {
      throw new BadRequestException(appError.NOT_FOUND_FAVS_ARTIST);
    }
    db.favs.artistIds.splice(artistIndex, 1);
  }

  private async removeAlbum(id: string): Promise<void> {
    const albumIndex = db.favs.albumIds.indexOf(id);
    if (albumIndex === -1) {
      throw new BadRequestException(appError.NOT_FOUND_FAVS_ALBUM);
    }
    db.favs.albumIds.splice(albumIndex, 1);
  }

  private async removeTrack(id: string): Promise<void> {
    const trackIndex = db.favs.trackIds.indexOf(id);
    if (trackIndex === -1) {
      throw new BadRequestException(appError.NOT_FOUND_FAVS_TRACK);
    }
    db.favs.trackIds.splice(trackIndex, 1);
  }

  async remove(
    source: 'artist' | 'album' | 'track',
    id: string,
  ): Promise<void> {
    switch (source) {
      case 'artist':
        await this.removeArtist(id);
        break;

      case 'album':
        await this.removeAlbum(id);
        break;

      case 'track':
        await this.removeTrack(id);
        break;

      default:
        throw new Error('Invalid source');
    }
  }
}
