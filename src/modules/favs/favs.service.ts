import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/fav.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import appError from 'src/common/constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  private async getService(source: Favorite['source']) {
    switch (source) {
      case 'album':
        return this.albumService;
      case 'artist':
        return this.artistService;
      case 'track':
        return this.trackService;
      default:
        throw new Error('Service is not found');
    }
  }

  private async getIdsBySource(
    source: Favorite['source'],
  ): Promise<Favorite['sourceId'][]> {
    const sourceIds: { sourceId: string }[] = await this.favoritesRepository
      .createQueryBuilder('favorites')
      .select('favorites."sourceId"')
      .where('favorites."source" = :source', { source })
      .getRawMany();
    return sourceIds.map((el) => el.sourceId);
  }

  private async getFavorite(
    source: Favorite['source'],
    sourceId: Favorite['sourceId'],
  ): Promise<Favorite | null> {
    return await this.favoritesRepository.findOneBy({ source, sourceId });
  }

  async create(
    source: Favorite['source'],
    sourceId: Favorite['sourceId'],
  ): Promise<Artist | Album | Track> {
    const service = await this.getService(source);
    let sourceElement: Track | Album | Artist | null = null;

    try {
      sourceElement = await service.findOne(sourceId);
    } catch (e) {
      switch (source) {
        case 'album':
          throw new UnprocessableEntityException(appError.ALBUM_ID_NOT_EXIST);
        case 'track':
          throw new UnprocessableEntityException(appError.TRACK_ID_NOT_EXIST);
        case 'artist':
          throw new UnprocessableEntityException(appError.ARTIST_ID_NOT_EXIST);
        default:
          throw new Error();
      }
    }

    const isFav = await this.getFavorite(source, sourceId);
    if (!isFav) {
      const dto = { source, sourceId };
      await this.favoritesRepository.save(dto);
    }

    return sourceElement;
  }

  async findAll(): Promise<Favorites> {
    const artistIds = await this.getIdsBySource('artist');
    const albumIds = await this.getIdsBySource('album');
    const trackIds = await this.getIdsBySource('track');
    console.log(artistIds);
    const response: Favorites = {
      artists: await this.artistService.findMany(artistIds),
      albums: await this.albumService.findMany(albumIds),
      tracks: await this.trackService.findMany(trackIds),
    };
    return response;
  }

  async remove(source: Favorite['source'], sourceId: string): Promise<void> {
    const fav = await this.getFavorite(source, sourceId);
    if (!fav) {
      switch (source) {
        case 'album':
          throw new BadRequestException(appError.NOT_FOUND_FAVS_ALBUM);
        case 'artist':
          throw new BadRequestException(appError.NOT_FOUND_FAVS_ARTIST);
        case 'track':
          throw new BadRequestException(appError.NOT_FOUND_FAVS_TRACK);
        default:
          throw new Error();
      }
    }
    await this.favoritesRepository.delete(fav.id);
  }
}
