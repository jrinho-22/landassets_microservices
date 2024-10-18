export class CreateEstateDto {
  estateId?: number;
  name: string;
  imgName: string;
  size: number;
  oceanDistance: number;
  plotsAvailable: number;
  population: number;
  counties: number;
  paymentTerm: string;
  averagePricePerSQM: number;
  averagePartialPaymentPrice: number;
}
