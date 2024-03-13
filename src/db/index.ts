import { Album } from 'src/modules/album/entities/album.entity';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { Fav } from 'src/modules/favs/entities/fav.entity';
import { Track } from 'src/modules/track/entities/track.entity';

interface Db {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  favs: Fav;
}

const db: Db = {
  albums: [],
  tracks: [],
  artists: [],
  favs: {
    artistIds: [],
    albumIds: [],
    trackIds: [],
  },
};

export default db;
