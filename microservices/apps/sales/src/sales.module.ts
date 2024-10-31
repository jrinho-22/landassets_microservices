import { Logger, Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import * as Common from '@app/common'
import { Sale } from './entities/sales.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), `db.${process.env.NODE_ENV || 'development'}.env`),
        join(process.cwd(), 'envs', 'sale', `${process.env.NODE_ENV || 'development'}.env`)
      ],
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        AUTH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        SERVICE1_PORT: Joi.number().required(),
        SERVICE1_HOST: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
        RABBITMQ_DEFAULT_USER: Joi.string().required(),
        RABBITMQ_DEFAULT_PASS: Joi.string().required(),
        RABBITMQ_DEFAULT_VHOST: Joi.string().required()
      }),
    }),
    Common.DatabaseModule.forRoot([Sale]),
    Common.DatabaseModule.forFeature([Sale]),
    Common.clientRegistryModule.registerAsync(Common.AUTH_SERVICE, Common.AUTH_QUEUE),
    Common.clientRegistryModule.registerAsync(Common.SERVICE1_SERVICE, Common.SERVICE1_QUEUE),
    // ClientsModule.registerAsync(
    //   [
    //     {
    //       inject: [ConfigService],
    //       name: Common.AUTH_SERVICE,
    //       useFactory: (configService: ConfigService) => ({
    //         transport: Transport.RMQ,
    //         options: {
    //           urls: [`amqp://${configService.get<string>('RABBITMQ_DEFAULT_USER')}:${configService.get<string>('RABBITMQ_DEFAULT_PASS')}@rabbit:5672/${configService.get<string>('RABBITMQ_DEFAULT_VHOST')}`],
    //           queue: 'auth_queue',
    //           queueOptions: {
    //             durable: false
    //           },
    //           // host: configService.get<string>('AUTH_HOST'),
    //           // port: configService.get<number>('AUTH_PORT'),
    //         },
    //       }),         
    //     },
    //     {
    //       name: Common.SERVICE1_SERVICE,
    //       inject: [ConfigService],
    //       useFactory: (configService: ConfigService) => ({
    //         transport: Transport.RMQ,
    //         options: {
    //           urls: [`amqp://${configService.get<string>('RABBITMQ_DEFAULT_USER')}:${configService.get<string>('RABBITMQ_DEFAULT_PASS')}@rabbit:5672/${configService.get<string>('RABBITMQ_DEFAULT_VHOST')}`],
    //           queue: 'service1_queue',
    //           queueOptions: {
    //             durable: false
    //           },
    //           // host: configService.get<string>('AUTH_HOST'),
    //           // port: configService.get<number>('AUTH_PORT'),
    //         },
    //       }),         
    //     },
        // {
        //   name: Common.AUTH_SERVICE,
        //   useFactory: (configService: ConfigService) => ({
        //     transport: Transport.TCP,
        //     options: {
        //       host: configService.get<string>('AUTH_HOST'),
        //       port: configService.get<number>('AUTH_PORT'),
        //     },
        //   }),
        //   inject: [ConfigService],
        // },
        // {
        //   name: Common.SERVICE1_SERVICE,
        //   useFactory: (configService: ConfigService) => ({
        //     transport: Transport.TCP,
        //     options: {
        //       host: configService.get<string>('SERVICE1_HOST'),
        //       port: configService.get<number>('SERVICE1_PORT'),
        //     },
        //   }),
        //   inject: [ConfigService],
        // },
      // ],
    // )
  ],
  controllers: [SalesController],
  providers: [
    Logger,
    SalesService,
    {
      provide: APP_GUARD,
      useClass: Common.JwtAuthGuard,
    },
    {
      provide: Common.Seeder,
      useFactory: (SalesService) => {
        return new Common.Seeder([{ service: SalesService, data: Common.salesSeed }]);
      },
      inject: [SalesService],
    },
  ],
})
export class SalesModule { }
