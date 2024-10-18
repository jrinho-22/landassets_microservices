import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import IState from 'src/app/interfaces/IState';
import { EstateModel } from 'src/app/modules/estado/models/estate.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
  standalone: true,
  imports: [ChartModule, CommonModule],
  providers: [EstateModel]
})
export class ChartComponent {
  basicData: any;
  basicOptions: any;
  dataProperties: (keyof IState)[] = ['plots', 'averagePricePerSQM', 'size', 'population']
  myData: any = {
    datasets: [],
    labels: []
  }

  constructor(
    private EstateModel: EstateModel,
  ) { }

  async getStates() {
    this.EstateModel.getData('').subscribe((response: IState[]) => {

      this.dataProperties.map((property: keyof IState, index: number) => {
        this.myData.datasets.push({
          label: property,
          yAxisID: 'y' + index,
          data: property =='plots' ? response.map(response => response[property]?.length) : response.map(response => response[property])
        })
      })

      response.map((state) => {
        this.myData.labels.push(state.name)
      })

      this.myData = { ...this.myData }
    })
  }

  ngOnInit() {
    this.getStates();
    this.basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      scales:

      {
        y: {
          display: false,
        },
        y1: {
          display: false,
        },
        y2: {
          display: false,
        },
        y3: {
          display: false,
        },
        y4: {
          display: false,
        }
      },
    }
  };
}
