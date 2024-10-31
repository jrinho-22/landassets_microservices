import { NestFactory } from '@nestjs/core';
import { SalesModule } from './sales.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SALES_QUEUE, Seeder, ServerRegistryService, SERVICE1_QUEUE } from '@app/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  await NestFactory.createApplicationContext(SalesModule)
    .then(async (appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder)
      await seeder.seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch(error => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });

  const app = await NestFactory.create(SalesModule);
  const configService = app.get(ConfigService);
  const serverRegistryService = app.get(ServerRegistryService)
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice(serverRegistryService.microserviceCon(SALES_QUEUE))
  app.setGlobalPrefix('api/sales');
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('HTTP_PORT'));
}
bootstrap();
