import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
    export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private UserService: UsersService) {
        super({
            usernameField: 'email', // Use the email field as the username
        });
    }

    async validate(email: string, password: string): Promise<any> {
        console.log(email, password, 'jnjsnx')
        // try {
        //     const user = await this.UserService.findByEmail(email);
        //     if (!user) {
        //         throw new UnauthorizedException('User not found');
        //     }
        //     if (user?.password == password) {
        //         return user
        //     }
        // } catch (error) {
        //     throw new UnauthorizedException(error);
        // }
    }
}