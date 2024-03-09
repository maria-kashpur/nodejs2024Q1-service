import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Fav, FavResponse } from './entities/fav.entity';
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

  async create(
    source: 'artist' | 'album' | 'track',
    id: string,
  ): Promise<Artist | Album | Track> {
    const { artistIds, albumIds, trackIds } = db.favs;
    switch (source) {
      case 'artist':
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

      case 'album':
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

      case 'track':
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

      default:
        throw new Error("Invalid source")
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

  async remove(source: 'artist' | 'album' | 'track', id: string): Promise<void> {
    switch (source) {
      case "artist":
        await this.artistService.removeFavorites(id);
        break;
      
      case "album":
        await this.albumService.removeFavorites(id);
        break;
      
      case "track": 
        await this.trackService.removeFavorites(id);
        break
    
      default:
        throw new Error('Invalid source');
    }
  }
}
