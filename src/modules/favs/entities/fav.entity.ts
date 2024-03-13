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
