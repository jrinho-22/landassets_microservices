import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.auth-guard';
import { JwtAuthGuard } from './guards/jwt.auth-guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from '@app/common';
// import { Public } from './auth.contants';
// import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Public()
  // @Post('auth/login')
  // signIn(@Body() signInDto: Record<string, any>) {
  //   return this.authClient.send('signin', { email: signInDto.email, password: signInDto.password })
  //     .pipe(
  //       catchError(() => {
  //         return throwError(() => new NotFoundException('User not foud'));
  //       })
  //     );
  // }

  // @Public()
  // @Post('auth/login/register')
  // async signUp(@Body() signUpDto: any) {
  //   return this.authClient.send('signup', signUpDto)
  //     .pipe(
  //       catchError((error: any) => {
  //         console.log(error)
  //         return throwError(() => new Error(error.message));
  //       })
  //     );
  // }

  @Public()
  @Get("connection")
  testConnection() {
    return {value:"Connected"}
  }


  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Payload() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('teste')
  teste(@Request() req: any) {
    return req.user
    // return this.authService.login(req.user);
    // return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // @Public()
  // @Post('login/register')
  @Post('login/register')
  async signUp(@Payload() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto);
  }
}
