import { Album } from 'src/modules/album/entities/album.entity';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { Track } from 'src/modules/track/entities/track.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Favorite')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'enum',
    enum: ['artist', 'album', 'track'],
  })
  source: 'artist' | 'album' | 'track';

  @Column()
  sourceId: string;
}

export class Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
