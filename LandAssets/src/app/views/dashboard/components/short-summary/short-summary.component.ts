import { Component, ElementRef} from '@angular/core';
import IState, { IStateEmpty, StateEmpty } from 'src/app/interfaces/IState';
import { EstateModel } from '../../models/estate.service';
import { DashboardService } from '../../utils/dashboard.service';
import { ViewportScroller } from '@angular/common';
import { skip } from 'rxjs';

@Component({
  selector: 'app-short-summary',
  templateUrl: './short-summary.component.html',
  styleUrls: ['./short-summary.component.sass'],
})
export class ShortSummaryComponent {
  states: IState[] | [] = [];
  selectedState: IState | IStateEmpty = StateEmpty;

  constructor(
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private EstateModel: EstateModel,
    private DashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.getStates();
    this.DashboardService.activeStateObs$
      .pipe(skip(1))
      .subscribe((activeState) => {
        this.selectedState = activeState.state;
        if (activeState.scroll) {
          const plotActionEl =
            this.elementRef.nativeElement.parentNode.children[1];
          const wrapperDiv =
            plotActionEl.getElementsByClassName('plotActionsWrapper');
          const rect = wrapperDiv[0].getBoundingClientRect();

          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const offsetTop = rect.top + scrollTop + 40;

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      });
  }

  getStates() {
    this.EstateModel.getData('').subscribe((response) => {
      this.states = response;
    });
  }

  receiveSelectData(data: string) {
    const activeState = this.states.find((v) => v.name == data);
    if (activeState) this.DashboardService.setState(activeState, true);
  }
}
