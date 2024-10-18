import { Estate } from '../../estate/estate.entity';
// import { Users } from '../../users/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';

@Entity({ name: 'plot', schema: 'public' })
export class Plot {
    @PrimaryGeneratedColumn()
    plotId?: number;

      @ManyToOne(() => Estate, (estate) => estate.plots)
      estate: Estate;

    //   @ManyToMany(
    // () => Users,
    // (user) => user.plot, //optional
    // {onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
    //   )
    //   users?: Users[];

    @Column()
    number: number;

    @Column()
    pricePerSQM: number;

    @Column()
    size: number;

    @Column()
    priceSQMPartialPayment: number;

    @Column()
    totalCashPrice: number;

    @Column()
    totalPartialPaymentPrice: number;

    @Column()
    firstInstallment: number;
}
