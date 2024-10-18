import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common';
import { AUTH_QUEUE, Seeder, ServerRegistryService } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  await NestFactory.createApplicationContext(AuthModule)
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

  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const serverRegistryService = app.get(ServerRegistryService)
  app.connectMicroservice(serverRegistryService.microserviceCon(AUTH_QUEUE))
  app.setGlobalPrefix('api/auth');
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('HTTP_PORT'))
}
bootstrap();
