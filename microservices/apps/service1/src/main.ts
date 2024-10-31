import { NestFactory } from '@nestjs/core';
import { Service1Module } from './service1.module';
import { v2 as cloudinary } from 'cloudinary';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Seeder } from '@app/common/database/seeder/seeder.service';
import { ConfigService } from '@nestjs/config';
import { ServerRegistryService, SERVICE1_QUEUE } from '@app/common';
import './cloundinary.conf'

async function bootstrap() {
  await NestFactory.createApplicationContext(Service1Module)
    .then(async (appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder)
      await seeder.seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch(error => {
          logger.error('Seeding fal ed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
    
  const app = await NestFactory.create(Service1Module);
  const configService = app.get(ConfigService);
  const serverRegistryService = app.get(ServerRegistryService)
  app.connectMicroservice(serverRegistryService.microserviceCon(SERVICE1_QUEUE))
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/service1');
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('HTTP_PORT'));
}
bootstrap();
