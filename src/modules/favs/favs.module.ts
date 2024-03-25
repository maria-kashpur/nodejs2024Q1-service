import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/fav.entity';

@Module({
  imports: [
    AlbumModule,
    ArtistModule,
    TrackModule,
    TypeOrmModule.forFeature([Favorite]),
  ],
  exports: [FavsService],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
