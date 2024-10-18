import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { Users } from './users/users.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as Common from '@app/common'
import { UsersService } from './users/users.service';
import * as Joi from 'joi'
import { join } from 'path';

@Module({
  imports: [
    UsersModule,
    DatabaseModule.forRoot([Users]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), `db.${process.env.NODE_ENV || 'development'}.env`),
        join(process.cwd(), 'envs', 'auth', `${process.env.NODE_ENV || 'development'}.env`)
      ],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        HTTP_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    Common.ServerRegistryService,
    AuthService,
    Logger,
    LocalStrategy,
    JwtStrategy,
    {
      provide: Common.Seeder,
      useFactory: (UsersService) => {
        return new Common.Seeder([{ service: UsersService, data: Common.userSeed }]);
      },
      inject: [UsersService],
    },
  ],
})
export class AuthModule { }
