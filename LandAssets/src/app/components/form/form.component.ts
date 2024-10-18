import { Component, Inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { HttpRequestService } from 'src/app/services/HttpRequest.service';
import { SnackbarService } from '../../services/snackbar.service';
import IFormParent from 'src/app/interfaces/IFormParent';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FORM_SUBMIT } from 'src/app/tokens/formSubmitHandler';
import { FlatButtonComponent } from '../buttons/flat-button/flat-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FlatButtonComponent],
})
export class FormComponent<T extends { [key: string]: any; }> {
  @Input() formGroup!: FormGroup;
  @Input() modal: boolean = false
  @Input() model!: HttpRequestService<T>;
  @Input() parent!: IFormParent<T>;
  paramId!: number;
  formType!: 'cadastro' | 'edicao' | 'view' ;
  old: any

  constructor(
    private snackbarService: SnackbarService,
    private activatedRoute: ActivatedRoute,
    @Inject(FORM_SUBMIT)
    private formSubmitted: BehaviorSubject<{formSubmitted: boolean}>
  ) { }

  ngOnInit() {
    this.old = {...this.formGroup}
    this.checkFormType();
    this.getCollection();
  }

  checkFormType() {
    const currentRoute = this.activatedRoute.routeConfig?.path;
    if (currentRoute?.includes('editar')) this.formType = 'edicao';
    else if (currentRoute?.includes('vizualizar')) {
      this.formType = 'view';
      this.formGroup.disable();
    } else if (currentRoute?.includes('cadastro')) {
      this.formType = 'cadastro'
    };

  }

  getCollection() {
    if (this.formType == 'edicao' || this.formType == 'view') {
      this.activatedRoute.params
        .pipe(
          switchMap((params) => {
            this.paramId = params['id'];
            return this.model.getItem(params['id']);
          })
        )
        .subscribe((data: T) => { this.populate(data) });
    }
  }

  populate(data: T) {
    var record: Record<string, any> = data
    if (typeof this.parent.beforeLoad == 'function') {
      record = this.parent.beforeLoad(data);
    }
    this.formGroup.patchValue(record);
  }

  async submit() {
    this.formSubmitted.next({
      formSubmitted: true
    })
    this.formGroup.markAllAsTouched()
    if (this.formGroup.status == 'VALID') {
      if (typeof this.parent?.submit === 'function') {
        this.parent?.submit()
        return 
      }

      if (typeof this.parent?.beforePost === 'function') {
        const postRecord: FormGroup | FormData | Record<string, any> = this.parent.beforePost(this.formGroup);
        this.sendData(postRecord);
      } else {
        this.sendData(this.formGroup);
      }
    }
  }

  sendData = (data: FormGroup | FormData | Record<string, any>) => {
    if (data instanceof FormGroup) data = data.value
    if (this.formType === 'edicao') {
      return this.model.putData(this.paramId, data).subscribe({complete: () => this.snackbarService.openSnack({panel:'success', message: 'Item editado com SUCESSO', menuMargin: !!this.formType }) });
    } else {
      return this.model.postData(data).subscribe({complete: () => this.snackbarService.openSnack({panel:'success', message: 'Item cadastrado com SUCESSO',  menuMargin: !!this.formType }) });
    }
  };
}
