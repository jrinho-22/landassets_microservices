import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AUTH_SERVICE } from '../constants';
import { ServerRegistryService } from './serverRegistry/serverRegistry.service';
import { ServerRegistryModule } from './serverRegistry/serverRegistry.module';

@Module({})
export class clientRegistryModule {
  static registerAsync(name: string, queue: string): DynamicModule {
    return {
      module: clientRegistryModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: name,
            imports: [ServerRegistryModule],
            inject: [ServerRegistryService],
            useFactory: (serverRegistryService: ServerRegistryService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [serverRegistryService.rabitUrl],
                queue: queue,
                queueOptions: {
                  durable: false
                },
              },
            }),         
          },
        ])
      ],
      exports: [ClientsModule]
    };
  }
}