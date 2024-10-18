import { Body, ConflictException, ConsoleLogger, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AUTH_SERVICE, Public, SERVICE1_SERVICE } from '@app/common';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaymentSaleDto } from './dto/payment-sale-dto';

@Controller('')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(SERVICE1_SERVICE) private readonly service1Client: ClientProxy,
    // private configService: ConfigService,
  ) { }

  @Post('')
  async create(@Payload() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto)
    // .catch((error) => {
    //   console.log(error)
    //   return Promise.reject(new RpcException(error))
    // })
  }

  @Post('payment/:id')
  async makePayment(@Body() body: PaymentSaleDto, @Param('id') id: string) {
    return this.salesService.makePayment(body, +id)
    // .catch((error) => {
    //   return Promise.reject(new RpcException(error))
    // })
  }

  @Get(':id')
  async findByUser(@Param('id') id: string) {
    const users = this.authClient.send('get/allUser', '')
      .pipe(
        catchError((error: any) => {
          console.log(error.name, 'eererer')
          return throwError(() => error);
        })
      );
    const plots = this.service1Client.send('get/allPlots', '')
      .pipe(
        catchError((error: any) => {
          return throwError(() => error);
        })
      )
    return this.salesService.findByUser(+id, plots, users)
    // .catch((error) => {
    //   return Promise.reject(new RpcException(error))
    // })
  }

  @Get('')
  async getAll() {
    const users = this.authClient.send('get/allUser', '')
      .pipe(
        catchError((error: any) => {
          return throwError(() => error);
        })
      );
    const plots = this.service1Client.send('get/allPlots', '')
      .pipe(
        catchError((error: any) => {
          return throwError(() => error);
        })
      )

    return await this.salesService.getAllSales(users, plots)
    // .catch((error) => {
    //   return Promise.reject(new RpcException(error))
    // })
  }
}
