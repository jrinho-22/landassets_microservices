import { Logger, Module } from '@nestjs/common';
import { PlotModule } from './plot/plot.module';
import { Plot } from './plot/entities/plot.entity';
import { APP_GUARD } from '@nestjs/core';
import { EstateModule } from './estate/estate.module';
import { Estate } from './estate/estate.entity';
import { Service1Controller } from './service1.controller';
import { EstateService } from './estate/estate.service';
import { PlotService } from './plot/plot.service';
import * as Common from '@app/common'
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), `db.${process.env.NODE_ENV || 'development'}.env`),
        join(process.cwd(), 'envs', 'service1', `${process.env.NODE_ENV || 'development'}.env`)
      ],
      isGlobal: true,
      validationSchema: Joi.object({
          HTTP_PORT: Joi.number().required(),
          TCP_PORT: Joi.number().required(),
          AUTH_PORT: Joi.number().required(),
          AUTH_HOST: Joi.string().required(),
          SALE_PORT: Joi.number().required(),
          SALE_HOST: Joi.string().required(),
          RABBITMQ_DEFAULT_USER: Joi.string().required(),
          RABBITMQ_DEFAULT_PASS: Joi.string().required(),
          RABBITMQ_DEFAULT_VHOST: Joi.string().required(),
          RABBITMQ_HOST: Joi.string().required()
      }),
    }),
    PlotModule,
    EstateModule,
    Common.DatabaseModule.forRoot([Plot, Estate]),
    Common.clientRegistryModule.registerAsync(Common.AUTH_SERVICE, Common.AUTH_QUEUE)
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: Common.JwtAuthGuard,
    },
    {
      provide: Common.Seeder,
      useFactory: (EstateService, PlotService) => {
        return new Common.Seeder([{service: EstateService, data: Common.estateSeed}, {service: PlotService, data: Common.plotSeed}]);
      },
      inject: [EstateService, PlotService],
    }
  ],
  controllers: [Service1Controller],
})
export class Service1Module { }
