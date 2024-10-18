// import { Users } from '../../../users/user.entity';

export const userSeed: any = [
  {
    name: 'admin',
    email: 'admin@gmail.com',
    phoneNumber: '091201920',
    password: '123',
    dob: new Date(1998, 0, 22),
    admin: true
  },
  {
    name: 'client',
    email: 'client@gmail.com',
    phoneNumber: '091201920',
    password: '123',
    dob: new Date(1998, 0, 22),
    admin: false
  },
];

