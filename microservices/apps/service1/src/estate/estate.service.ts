import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Estate } from './estate.entity';
import { ImgUploadService } from '../../src/services/img-upload.service';

@Injectable()
export class EstateService {
  constructor(
    @InjectRepository(Estate)
    private estateRepository: Repository<Estate>,
  ) { }

  createSeed(estateSeed: Estate[]): Array<Promise<Estate>> {
    return estateSeed.map(async (estate: Estate) => {
      return await this.estateRepository
        .findOne({
          where: {
            name: estate.name,
          },
        })
        .then(async (dbEstate) => {
          if (dbEstate) {
            return Promise.resolve(null);
          }
          return Promise.resolve(await this.estateRepository.save(estate));
        })
        .catch((error) => {
          Promise.reject(error)
        })
    });
  }

  async create(
    createEstateDto: CreateEstateDto,
    file: Express.Multer.File,
  ): Promise<Estate> {
    try {
      const res = await ImgUploadService.upload(file.buffer)
      const estate = {
        ...createEstateDto,
        plotsAvailable: Number(createEstateDto.plotsAvailable),
        counties: Number(createEstateDto.counties),
        mapId: res.display_name,
        mapName: file.originalname,
      };

      return await this.estateRepository.save(estate);
    } catch (err) {
      console.error('Error:', err);
      throw new Error('Error creatig esate');
    }
  }

  async updateOne(
    id: number,
    createEstateDto: CreateEstateDto,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    return await this.estateRepository
      .findOne({
        where: {
          estateId: id,
        },
      })
      .then(async (estate: Estate) => {
        let res: any
        try {
          if (file.buffer.length) {
            res = await ImgUploadService.upload(file.buffer)
            await ImgUploadService.remove(estate.mapId)
          }
          const newEstate = this.estateRepository.create({
            ...createEstateDto,
            mapName: file.buffer.length ? file.originalname : estate.mapName,
            mapId: res ? res.display_name : estate.mapId,
          });
          return await this.estateRepository.update(id, newEstate);

        } catch (err) {
          console.error('Error:', err);
          throw new Error('Error creating estate');
        }

      });
  }

  async findAll(): Promise<Estate[]> {
    return this.estateRepository.find({ relations: ['plots'] })
    // .then((v) => {
    //   return Promise.all(
    //     v.map((v) => {
    //       const chunks: any[] = [];
    //       const imgPath = v.map;
    //       let readStream: fs.ReadStream
    //       if (process.env.NODE_ENV == 'development') {
    //         readStream = fs.createReadStream('src/assets/imgs/mapa1.jpg');
    //       } else {
    //         readStream = fs.createReadStream(path.join(__dirname, '..', 'assets', 'imgs', imgPath.split('\\').pop()));
    //       }
    //       return new Promise<Estate>((resolve, reject) => {
    //         readStream.on('data', (chunk) => {
    //           chunks.push(chunk);
    //         });

    //         readStream.on('end', () => {
    //           const imageData = Buffer.concat(chunks);
    //           const base64Image = imageData.toString('base64');
    //           resolve({ ...v, map: base64Image });
    //         });

    //         readStream.on('error', (error) => {
    //           reject(error);
    //         });
    //       });
    //     }),
    //   );
    // });
  }

  async findOne(
    estateId: number,
  ): Promise<Estate | null> {
    return this.estateRepository
      .findOne({
        where: {
          estateId: estateId,
        },
      })
  }

  update(id: number, updateEstateDto: UpdateEstateDto) {
    return `This action updates a ${id} estate`;
  }

  async remove(id: number) {
    const estate = await this.estateRepository.findOne({
      where: {
        estateId: id,
      },
      relations: ['plots']
    })
    if (estate.plots.length) {
      throw new ConflictException(`Estado ${estate.name} possui plots relacionados`);
    }
    return this.estateRepository.delete(id);
  }
}
