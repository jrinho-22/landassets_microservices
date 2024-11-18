import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IPlot from 'src/app/interfaces/IPlot';
import IState, { StateEmpty } from 'src/app/interfaces/IState';
import { IStateDash } from '../../../interfaces/plot-actions/IStateDash';

@Injectable()
export class DashboardService {
  public activeState: BehaviorSubject<IStateDash> =
    new BehaviorSubject<IStateDash>({ state: StateEmpty, scroll: false });

  // public activePlot: BehaviorSubject<IPlot | undefined> = new BehaviorSubject<
  //   IPlot | undefined
  // >(undefined);

  constructor() { }

  // activePlotObs$ = this.activePlot.asObservable();
  activeStateObs$ = this.activeState.asObservable();

  setState(newState: IState, triggerScroll: boolean) {
    this.activeState.next({ state: newState, scroll: triggerScroll });
  }

}
