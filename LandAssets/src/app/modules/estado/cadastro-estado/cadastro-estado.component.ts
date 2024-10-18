import { Component, ViewChild } from '@angular/core';
import IState from 'src/app/interfaces/IState';
import { EstateModel } from '../models/estate.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import IFormParent from 'src/app/interfaces/IFormParent';
import { CustomValidators } from 'src/app/utils/validators/CustomValidators';
import { convertMoneyFormat } from 'src/app/helpers/inputs/moneyMaskConverter';

@Component({
  selector: 'app-cadastro-estado',
  templateUrl: './cadastro-estado.component.html',
  styleUrls: ['./cadastro-estado.component.sass'],
  providers: [EstateModel],
})
export class CadastroEstadoComponent implements IFormParent<IState> {
  stateForm: FormGroup;
  name: any = '';
  formData: FormData = new FormData();
  paymentTermValues = [
    { value: 'Bi-annual Payments', label: 'Annual Payment' },
    { value: 'Flexible', label: 'Flexible' },
    { value: 'Monthly Installments', label: 'Monthly Payment' }
  ]
  @ViewChild('fileInput') fileInput!: any;

  constructor(
    private formBuilder: FormBuilder,
    protected EstateModel: EstateModel
  ) {
    this.stateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      size: ['', Validators.required],
      imgName: ['', Validators.required],
      oceanDistance: ['', Validators.required],
      plotsAvailable: ['', Validators.required],
      population: ['', Validators.required],
      counties: ['', Validators.required],
      paymentTerm: ['', Validators.required],
      averagePricePerSQM: ['', [Validators.required, CustomValidators.currencyMasked(5)]],
      averagePartialPaymentPrice: ['', Validators.required],
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length) {
      const file: File = event.target.files[0];
      if (file) {
        this.readFile(file).then((result: ArrayBuffer | null) => {
          if (result) {
            const blob = new Blob([new Uint8Array(result)]);

            this.formData.set('file', blob, file.name)
            this.stateForm.patchValue({
              imgName: file.name
            });
          } else {
            console.error('Failed to read file');
          }
        });
      }
    } else {
      this.stateForm.patchValue({
        imgName: ''
      });
    }
  }

  private readFile(file: File): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  beforePost(data: FormGroup) {
    // if text field has been edited will be string, if not it will be what came from back
    const newData = {
      ...data.value,
      averagePartialPaymentPrice: convertMoneyFormat(data.value.averagePartialPaymentPrice),
      averagePricePerSQM: convertMoneyFormat(data.value.averagePricePerSQM)
    }
    for (var key in newData) {
      this.formData.set(key, newData[key]);
    }
    return this.formData
  }

  beforeLoad(data: IState) {
    const emptyBlob = new Blob([]);
    const emptyFile = new File([], data['mapName']);
    this.formData.append('file', emptyBlob, emptyFile.name);
    this.stateForm.patchValue({
      imgName: emptyFile.name
    });

    let container = new DataTransfer();
    container.items.add(emptyFile);
    const fileInputElement = this.fileInput.nativeElement as HTMLInputElement;
    fileInputElement.files = container.files;

    return data
  }
}
