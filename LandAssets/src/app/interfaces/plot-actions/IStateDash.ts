import IState, { IStateEmpty } from "src/app/interfaces/IState";

export interface IStateDash {
    state: IState | IStateEmpty, 
    scroll: boolean
};