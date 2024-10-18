import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ContentChild, Input, SimpleChange, SimpleChanges, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { SnackbarService } from '../../services/snackbar.service';
import { PaginationComponent } from './pagination/pagination.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
  standalone: true,
  imports: [CommonModule, PaginationComponent, MatProgressSpinnerModule, IconButtonComponent]
})
export class TableComponent<T> {
  @Input() headers: { field: string; label: string, render?: (arg: any) => any }[] = [];
  @Input() collections: Array<any> | undefined = undefined;
  @Input() idField: string = "id";
  @Input() basePath: string = "";
  @Input() model!: HttpRequestService<T>;
  @Input() defaultActions: boolean = true;
  @Input() title: string = '';
  loading: boolean = true;
  currentCollection!: Array<any>
  @ContentChild('actions') actionsRef!: TemplateRef<any>;

  ngOnChanges({ collections }: SimpleChanges) {
    if (collections.currentValue) this.loading = false
  }

  setLoading(loading: boolean){
    this.loading = loading
  }

  getCurrentCollection(v: any){
    this.currentCollection = v
    this.cdr.detectChanges();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  visualizar(collection: any) {
    this.router.navigate([`${this.basePath}/vizualizar/${collection[this.idField]}`]);
  }

  getField(collection: any, field: any) {
    const separatedStrings = field.split(".");
    if (separatedStrings.length > 1) {
      return collection[separatedStrings[0]][separatedStrings[1]]
    }
    return collection[field]
  }

  editar(collection: any) {
    this.router.navigate([`${this.basePath}/editar/${collection[this.idField]}`]);
  }


  reload() {
    setTimeout(() => {
      window.location.reload()
    }, 1200);
  }

  excluir(collection: any) {
    this.model.deleteData(collection[this.idField]).subscribe(
      {
        complete: () => {
          this.snackbarService.openSnack({ panel: 'success', message: 'Item excluido com SUCESSO' });
          this.reload()
        }
      }
    )
  }
}
