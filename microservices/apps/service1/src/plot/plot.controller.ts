import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, HttpException, HttpStatus } from '@nestjs/common';
import { PlotService } from './plot.service';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { Plot } from './entities/plot.entity';
import { Public } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('plot')
export class PlotController {
  constructor(
    // @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly plotService: PlotService
  ) {}

  @Post()
  create(@Body() createPlotDto: CreatePlotDto) {
    return this.plotService.create(createPlotDto);
  }

  @Get()
  findBy(@Query() query?: Object): Promise<Plot[]> {
    return this.plotService.findBy(query);
  }

  @MessagePattern('get/allPlots')
  findAllMessage() {
    return this.plotService.findAll();
  }

  @Public()
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() body: UpdatePlotDto) {
    console.log('fell')
      return this.plotService.updateOne(+id, body);
  }

  @Public()
  @Get()
  findAll(): Promise<Plot[]> {
    return this.plotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Plot> {
    return this.plotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlotDto: UpdatePlotDto) {
    return this.plotService.update(+id, updatePlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plotService.remove(+id);
  }
}
