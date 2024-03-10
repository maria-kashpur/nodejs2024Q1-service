import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlbumService } from 'src/modules/album/album.service';
import { FavsService } from 'src/modules/favs/favs.service';
import { TrackService } from 'src/modules/track/track.service';

@Injectable()
export class DeleteSourceListener {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
  ) {}

  @OnEvent('remove.track', { async: true })
  async deleteTrack(id: string): Promise<void> {
    await this.favsService.remove('track', id);
  }

  @OnEvent('remove.artist', { async: true })
  async deleteArtist(id: string): Promise<void> {
    await this.trackService.removeArtistId(id);
    await this.albumService.removeArtistId(id);
    await this.favsService.remove('artist', id);
  }

  @OnEvent('remove.album', { async: true })
  async deleteAlbum(id: string): Promise<void> {
    await this.trackService.removeAlbumId(id);
    await this.favsService.remove('album', id);
  }
}
