import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class PaymentSaleDto {
    @IsNotEmpty()
    plotId: number;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => {
      return  value === 'False' || value === 'false' || value === '0' ? false : Boolean(value);
    })
    fullPayment: boolean;
}
