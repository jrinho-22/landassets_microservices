import { Plot } from '../plot/entities/plot.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({name: "estate", schema: 'public'})
export class Estate {
    @PrimaryGeneratedColumn()
    estateId?: number;

    @Column()
    name: string;

    @Column()
    mapId: string;

    @Column()
    mapName: string;

    @Column()
    size: number;

    @Column()
    oceanDistance: number;

    @Column()
    plotsAvailable: number;

    @OneToMany(() => Plot, (plot) => plot.estate)
    plots?: Plot[];

    @Column()
    population: number;

    @Column()
    counties: number;

    @Column()
    paymentTerm: string;

    @Column()
    averagePricePerSQM: number;

    @Column()
    averagePartialPaymentPrice: number;
}
