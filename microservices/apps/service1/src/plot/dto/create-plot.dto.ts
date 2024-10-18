import { IsNotEmpty } from 'class-validator';

export class CreatePlotDto {
    @IsNotEmpty()
    estateId: number;

    @IsNotEmpty()
    number: number;

    @IsNotEmpty()
    pricePerSQM: number;

    @IsNotEmpty()
    size: number;

    @IsNotEmpty()
    priceSQMPartialPayment: number;

    @IsNotEmpty()
    totalCashPrice: number;

    @IsNotEmpty()
    totalPartialPaymentPrice: number;

    @IsNotEmpty()
    firstInstallment: number;
}

