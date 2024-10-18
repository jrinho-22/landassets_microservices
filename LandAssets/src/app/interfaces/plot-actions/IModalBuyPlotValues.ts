import IPlot from "../IPlot";
import IState from "../IState";

type MappedPlotValues = {
    [K in keyof IPlot]?: any;
    // [K in keyof IState]: IState[K];
    // plotId: IPlot | undefined,
    // plotNumber: number | undefined,
    // stateName: string | undefined,
    // totalPrice: number | undefined,
}

export default interface IModalBuyPlotValues extends MappedPlotValues{}