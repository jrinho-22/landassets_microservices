import IState from "./IState";

export default interface IPlot {
  estate?: IState
  plotId: number;
  estateId: number | undefined;
  number: number;
  pricePerSQM: number;
  size: string;
  priceSQMPartialPayment: number;
  totalCashPrice: number;
  totalPartialPaymentPrice: number;
  firstInstallment: number;
}

export interface IPlotEmpty {
  plotId: null,
  estateId: null,
  number: null,
  pricePerSQM: null,
  size: null,
  priceSQMPartialPayment: null,
  totalCashPrice: null,
  totalPartialPaymentPrice: null,
  firstInstallment: null
}

export const PlotEmpty: IPlotEmpty = {
  plotId: null,
  estateId: null,
  number: null,
  pricePerSQM: null,
  size: null,
  priceSQMPartialPayment: null,
  totalCashPrice: null,
  totalPartialPaymentPrice: null,
  firstInstallment: null
}
