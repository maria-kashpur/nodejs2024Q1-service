import { Album } from "src/modules/album/entities/album.entity";
import { Artist } from "src/modules/artist/entities/artist.entity";
import { Fav } from "src/modules/favs/entities/fav.entity";
import { Track } from "src/modules/track/entities/track.entity";
import { User } from "src/modules/user/entities/user.entity"

interface Db {
  users: User[];
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  favs: Fav
}

const db: Db = {
  users: [],
  albums: [],
  tracks: [],
  artists: [],
  favs: {
    artistIds: [],
    albumIds: [],
    trackIds: [],
  },
};

export default db
