import { Album } from "src/modules/album/entities/album.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;

  // @OneToMany(() => Album, (album) => album.artistId)
  // albums: Album;
}
