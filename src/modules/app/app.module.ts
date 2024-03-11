import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { FavsModule } from '../favs/favs.module';
import { ConfigModule } from '@nestjs/config';
import configurations from '../../configurations';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeleteSourceListener } from 'src/common/listeners/delete-source.listener';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    EventEmitterModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, DeleteSourceListener],
})
export class AppModule {}
