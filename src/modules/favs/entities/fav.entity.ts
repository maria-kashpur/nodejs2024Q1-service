import { Album } from 'src/modules/album/entities/album.entity';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { Track } from 'src/modules/track/entities/track.entity';

export class Fav {
  artistIds: string[]; // favorite artists ids
  albumIds: string[]; // favorite albums ids
  trackIds: string[]; // favorite tracks ids
}

export class FavResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
