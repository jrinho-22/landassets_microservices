import { IsNotEmpty } from "class-validator";

export class CreateSaleDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    plotId: number;

    @IsNotEmpty()
    totalInstallments: number;

    @IsNotEmpty()
    totalCost: number;
}
