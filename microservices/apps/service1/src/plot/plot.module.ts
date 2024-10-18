import { Module } from '@nestjs/common';
import { PlotService } from './plot.service';
import { PlotController } from './plot.controller';
import { Plot } from './entities/plot.entity';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/common/auth';
import { Estate } from '../estate/estate.entity';

@Module({
  imports: [DatabaseModule.forFeature([Plot, Estate])],
  controllers: [PlotController],
  providers: [PlotService],
  exports: [PlotService]
})
export class PlotModule { }
