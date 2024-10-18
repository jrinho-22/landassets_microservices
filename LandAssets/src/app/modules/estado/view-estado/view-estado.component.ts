import { Component } from '@angular/core';
import { EstateModel } from '../models/estate.service';
import IState from 'src/app/interfaces/IState';
import { baseRoute } from '../routes';

@Component({
  selector: 'app-view-estado',
  templateUrl: './view-estado.component.html',
  styleUrls: ['./view-estado.component.sass'],
  providers: [EstateModel],
})
export class ViewEstadoComponent {
  estates: IState[] | undefined = undefined;
  headers: any[] = [
    { field: 'name', label: 'Name' },
    { field: 'counties', label: 'Cidades' },
    { field: 'size', label: 'Size', render: (v: number) => v.toLocaleString('pt-BR') + ' m2' },
    { field: 'population', label: 'Population', render: (v: number) => v.toLocaleString('pt-BR') },
    { field: 'paymentTerm', label: 'Payment term' }];
  basePath: string = baseRoute;

  constructor(public EstateModel: EstateModel) {}

  ngOnInit() {
    this.EstateModel.getData('').subscribe((v) => (this.estates = v));
  }
}
