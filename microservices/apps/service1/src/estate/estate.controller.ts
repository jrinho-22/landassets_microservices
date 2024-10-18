import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { EstateService } from './estate.service';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';
import * as fs from 'fs';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@app/common/decorators/public';

@Controller('estate')
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create( @Body() body: CreateEstateDto, @UploadedFile() file: Express.Multer.File) {
    return this.estateService.create(body, file);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.estateService.findAll();
  }

  @Get('/img')
  async getImage(@Res() res: Response) {
    const filePath = 'src/assets/imgs/estateMap.png';
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estateService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  updateOne(@Param('id') id: string, @Body() body: CreateEstateDto, @UploadedFile() file: Express.Multer.File) {
    return this.estateService.updateOne(+id, body, file);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstateDto: UpdateEstateDto) {
    return this.estateService.update(+id, updateEstateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estateService.remove(+id);
  }
}
