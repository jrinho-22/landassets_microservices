export class CreateUserDto {
    name: string;
    phoneNumber?: string;
    email: string;
    password: string;
    dob?: Date
    admin: boolean
}
