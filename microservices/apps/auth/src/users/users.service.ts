import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  createSeed(usersSeed: Users[]): Array<Promise<Users>> {
    return usersSeed.map(async (user: Users) => {
      return await this.usersRepository
        .findOne({
          where: {
            name: user.name,
          },
        })
        .then(async (dbUser) => {
          if (dbUser) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.usersRepository.save(user),
          );
        })
        .catch((error) => Promise.reject(error));
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const existingUser = await this.findByEmail(createUserDto.email)
    if (existingUser) {
      throw new ConflictException('Email already registered');
    } else {
      try {
        return this.usersRepository.save(createUserDto);
      } catch (error) {
        throw new InternalServerErrorException('Error saving user');
      }
    }
  }

  findAll(): any {
    return this.usersRepository.find();
  }

  findOne(userId: number): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  findByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
