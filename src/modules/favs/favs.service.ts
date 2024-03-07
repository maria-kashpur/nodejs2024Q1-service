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
    private readonly trackSerrvice: TrackService,
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
          track = await this.trackSerrvice.findOne(id);
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
      tracks: await this.trackSerrvice.findMany(trackIds),
    };
    return response;
  }

  async remove(source: 'artist' | 'album' | 'track', id: string): Promise<void> {
    const { artistIds, albumIds, trackIds } = db.favs;
    switch (source) {
      case "artist":
        const artistIndex = db.favs.artistIds.indexOf(id);
        if (artistIndex === -1) {
          throw new BadRequestException(appError.NOT_FOUND_FAVS_ARTIST);
        }
        db.favs.artistIds.splice(artistIndex, 1);
        break;
      
      case "album":
        const albumIndex = db.favs.albumIds.indexOf(id);
        if (albumIndex === -1) {
          throw new BadRequestException(appError.NOT_FOUND_FAVS_ALBUM);
        }
        db.favs.albumIds.splice(albumIndex, 1);
        break;
      
      case "track": 
        const trackIndex = db.favs.trackIds.indexOf(id);
        if (trackIndex === -1) {
          throw new BadRequestException(appError.NOT_FOUND_FAVS_TRACK);
        }
        db.favs.trackIds.splice(trackIndex, 1);
      break
    
      default:
        throw new Error('Invalid source');
    }
  }
}
