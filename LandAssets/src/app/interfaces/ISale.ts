import IPlot from "./IPlot"
import IUser from "./IUser"

export default interface ISale {
  userId: number
  plotId: number
  totalInstallments: number;
  remainingInstallments: number;
  totalCost: number;
  remainingCost: number;
  plot?: IPlot
  user?: IUser
}
