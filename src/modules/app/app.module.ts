import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { FavsModule } from '../favs/favs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from '../../configurations';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        password: configService.get('db_password'),
        username: configService.get('db_username'),
        database: configService.get('db_database'),
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,

  ],
})
export class AppModule {}
