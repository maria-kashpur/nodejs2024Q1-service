import { Album } from "src/modules/album/entities/album.entity";
import { Artist } from "src/modules/artist/entities/artist.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  // @ManyToOne(() => Artist, { onDelete: 'SET NULL' })
  // artist: Artist;

  // @ManyToOne(() => Album, { onDelete: 'SET NULL' })
  // album: Album;
}
