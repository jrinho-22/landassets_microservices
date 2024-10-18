import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, Unique } from "typeorm";

@Entity('sale')
@Unique(['plotId'])
export class Sale {
    @PrimaryColumn({ name: 'userId' })
    userId: number;
  
    @PrimaryColumn({ name: 'plotId' })
    plotId: number;

    @Column({default: 0})
    totalInstallments: number;

    @Column({default: 0})
    remainingInstallments: number;

    @Column({default: 0})
    totalCost: Number;

    @Column({default: 0})
    installmentCost: Number;

}
