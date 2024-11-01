// import { Plot } from '../plot/plot.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity({name: "users", schema: 'public'})
export class Users {
  @PrimaryGeneratedColumn()
  userId?: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: "000000000" })
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  type: string;

  // @ManyToMany(
  //   () => Plot,
  //   plot => plot.users,
  //   {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
  // )
  // @JoinTable({
  //   name: 'sale',
  //   joinColumn: {
  //     name: 'userId',
  //     referencedColumnName: 'userId',
  //   },
  //   inverseJoinColumn: {
  //     name: 'plotId',
  //     referencedColumnName: 'plotId',
  //   },
  // })
  // plot?: Plot[]; 

  @Column({ type: 'date', default: '1998-05-21' })
  dob: Date;

//   @Column({ default: true })
//   isActive: boolean;
}