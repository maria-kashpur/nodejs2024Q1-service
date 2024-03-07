import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import getSwagerConfig from './common/swager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.useGlobalPipes(new ValidationPipe());

  getSwagerConfig(app);

  await app.listen(port);
  console.log(
    `Server started: ${await app.getUrl()} \nApi documentation:  ${await app.getUrl()}/doc`,
  );
}
bootstrap();
