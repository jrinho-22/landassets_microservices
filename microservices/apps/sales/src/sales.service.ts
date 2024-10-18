import { BadGatewayException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sales.entity';
import { Repository } from 'typeorm';
import { catchError, combineLatestWith, map, merge, mergeMap, Observable, of, pipe, switchMap, tap, throwError } from 'rxjs';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaymentSaleDto } from './dto/payment-sale-dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
  ) { }

  createSeed(sales: CreateSaleDto[]): Array<Promise<Sale>> {
    return sales.map(async (sale) => {
      return await this.saleRepository.findOne({
        where: {
          userId: sale.userId,
          plotId: sale.plotId,
        },
      }).then(async (existingSale) => {
        if (existingSale) {
          return Promise.resolve(null)
        } else {
          console.log('sale: ', sale)
          return await this.saleRepository.save(sale)
        }
      }).catch(error => Promise.resolve(error))
    })
  }

  async create(createSaleDto: CreateSaleDto) {
    try {
      const sale = await this.saleRepository.findOne({ where: { plotId: createSaleDto.plotId } })
      if (sale) throw new ConflictException(`Plot no longer available`);
      const getlInstallmentPrice = () => {
        if (createSaleDto.totalInstallments > 1) {
          return createSaleDto.totalCost / createSaleDto.totalInstallments
        }
        return 0
      }

      const newSale = this.saleRepository.create({
        ...createSaleDto,
        installmentCost: getlInstallmentPrice(),
        remainingInstallments: createSaleDto.totalInstallments,
      });

      return await this.saleRepository.save(newSale);
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async makePayment(paymentSaleDto: PaymentSaleDto, userId: number){
    const sale = await this.saleRepository.findOne({where: {plotId: paymentSaleDto.plotId, userId: userId}})
    let payment
    if (paymentSaleDto.fullPayment) {
      payment = this.saleRepository.create({
        ...sale,
        remainingInstallments: 0,
      })
    } else {
      payment = this.saleRepository.create({
        ...sale,
        remainingInstallments: sale.remainingInstallments > 0 ? sale.remainingInstallments - 1 : 0,
      })
    }
    const updatedEntity = this.saleRepository.merge(sale, payment)
    return this.saleRepository.save(updatedEntity);
  }

  async getAllSales(users: Observable<any>, plots: Observable<any>) {
    const sales = await this.saleRepository.find()
    return plots.pipe(
      combineLatestWith(users),
      map(([plots, users]) => {
        return sales.map((sale) => {
          const user = users.find((user: any) => user.userId === sale.userId);
          const plot = plots.find((plot: any) => plot.plotId === sale.plotId);
          return { ...sale, plot: plot, users: user };
        });
      })
    );
  }

  async findByUser(id: number, plots: Observable<any>, users:  Observable<any>) {
    const sales = await this.saleRepository.find({where: {userId: id}})
    if (!sales) {
      return Promise.reject(new NotFoundException("Usuario não possui compras"))
    }
    return plots.pipe(
      combineLatestWith(users),
      map(([plots, users]) => {
        return sales.map((sale) => {
          const user = users.find((user: any) => user.userId === sale.userId);
          const plot = plots.find((plot: any) => plot.plotId === sale.plotId);
          return { ...sale, plot: plot, user: user };
        });
      })
    );
  }
}
