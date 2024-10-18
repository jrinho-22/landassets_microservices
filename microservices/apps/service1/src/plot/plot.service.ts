import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estate } from '../estate/estate.entity';
import { Repository } from 'typeorm';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdatePlotDto } from './dto/update-plot.dto';
import { Plot } from './entities/plot.entity';

@Injectable()
export class PlotService {
  constructor(
    @InjectRepository(Plot)
    private plotRepository: Repository<Plot>,
    @InjectRepository(Estate)
    private EstateRepository: Repository<Estate>,
  ) { }

  async create(plot: CreatePlotDto): Promise<Plot> {
    return await this.plotRepository
      .findOne({
        where: {
          estate: { estateId: plot.estateId },
          number: plot.number,
        },
      })
      .then(async (dbPlot) => {
        if (dbPlot) {
          throw new ConflictException(`Plot with Number ${plot.number} and stateId ${plot.estateId} already exists`);
        }
        return this.EstateRepository.findOne({
          where: {
            estateId: plot.estateId,
          },
        });
      })
      .then(async (estateEntity) => {
        if (!estateEntity) {
          throw new NotFoundException(`Estate with ID ${plot.estateId} not found`);
        }
        const plotCreated = this.plotRepository.create({
          ...plot,
          estate: estateEntity,
        });

        return await this.plotRepository.save(plotCreated)
      }).catch((error) => Promise.reject(error));
  }

  createSeed(plotSeed: CreatePlotDto[]): Array<Promise<Plot | null>> {
    return plotSeed.map(async (plot: CreatePlotDto) => {
      return await this.plotRepository
        .findOne({
          where: {
            estate: { estateId: plot.estateId },
            number: plot.number,
          },
        }).then(async (dbplot) => {
          if (dbplot) {
            return null
          } else {
            return await this.create(plot)
          }
        });
    });
  }

  async findBy(query: Object): Promise<Plot[]> {
    if (!Object.keys(query).length) return this.plotRepository.find({ relations: ['estate'] });

    try {
      const value = Object.values(query)[0];
      const key: string = Object.keys(query)[0];
      if (key.includes('.')) {
        const conpondKey = key.split('.');
        return await this.plotRepository.findBy({
          [conpondKey[0]]: { [conpondKey[1]]: value },
        });
      }
      return await this.plotRepository.findBy({ [key]: value });
    } catch (error) {
      throw new NotFoundException(`Field ${Object.keys(query)[0]} not found`);
    }
  }

  async updateOne(id: number, body: UpdatePlotDto) {
    let state: Estate

    return await this.plotRepository
      .findOne({
        relations: ['estate'],
        where: {
          plotId: id,
        },
      }).then(async (plot: Plot) => {
        if (!plot) throw new NotFoundException(`Plot with ID ${id} not found`);
        return this.plotRepository.findOne({
          relations: ['estate'],
          where: {
            estate: { estateId: body.estateId ? body.estateId : plot.estate.estateId },
            number: body.number ? body.number : plot.number,
          },
        })
      }).then(async (existingPlot: Plot) => {
        if (existingPlot) throw new ConflictException(`Plot with Number ${existingPlot.number} and stateId ${existingPlot.estate.estateId} already exists`);
        if (body.estateId) {
          state = await this.EstateRepository.findOne({
            where: {
              estateId: Number(body.estateId),
            },
          })
        }
        const newPlot = state ? this.plotRepository.create({
          ...body,
          estate: state
        }) : this.plotRepository.create({
          ...body
        })
        return this.plotRepository.update(id, newPlot);
      }).catch((error) => Promise.reject(error));
  }
 
  findOne(id: number) {
    return this.plotRepository.findOne({
      where: {
        plotId: id,
      },
      relations: ['estate']
    });
  }

  findAll() {
    return this.plotRepository.find()
  }

  update(id: number, updatePlotDto: UpdatePlotDto) {
    return `This action updates a #${id} plot`;
  }

  remove(id: number) {
    return this.plotRepository.delete(id);
  }
}
