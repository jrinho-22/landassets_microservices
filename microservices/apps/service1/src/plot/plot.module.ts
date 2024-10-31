import { Module } from '@nestjs/common';
import { PlotService } from './plot.service';
import { PlotController } from './plot.controller';
import { Plot } from './entities/plot.entity';
import { DatabaseModule } from '@app/common';
import { Estate } from '../estate/estate.entity';

@Module({
  imports: [DatabaseModule.forFeature([Plot, Estate])],
  controllers: [PlotController],
  providers: [PlotService],
  exports: [PlotService]
})
export class PlotModule { }
