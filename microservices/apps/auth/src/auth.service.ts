import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { Users } from './users/users.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(user: any) {
    const payload = { userId: user.userId, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user
    };
  }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string, user: Users }> {
    console.log(email, pass)
    const user = await this.usersService.findByEmail(email);
    if (!user || user?.password !== pass) throw new NotFoundException('User not found');
    const payload = { userId: user.userId, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user
    };
  }

  async signUp(signUpDto: CreateUserDto): Promise<{ access_token: string, user: Users }> {
    try {
      const user = await this.usersService.create(signUpDto);
      const payload = { userId: user.userId, username: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        user: user
      };
    } catch (error) {
      if (error instanceof HttpException) {  
        throw new RpcException(error.message);
      }
    }
  }
}
