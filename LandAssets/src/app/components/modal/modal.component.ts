import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { modalSizeConverter } from './utils/modalSizeConverter';
import IModalData from 'src/app/interfaces/IModalData';
import { FlatButtonComponent } from '../buttons/flat-button/flat-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FlatButtonComponent,
    FormsModule,
    MatButtonModule,
    MatGridListModule,
  ],
})
export class ModalComponent {

  @Output() actionButtonClicked = new EventEmitter<any>();
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild('mycontainer', { read: ViewContainerRef }) mycontainer!: ViewContainerRef;
  loading!: boolean
  modalSize!: { height: string; width: string };
  componentRef!: ComponentRef<any>;
  formContainer!: ViewContainerRef;

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: IModalData
  ) { }

  ngOnInit() {
    this.modalSize = modalSizeConverter(this.data.size);
  }

  onActionButtonClose() {
    this.dialogRef.close();
  }
  

  ngAfterViewInit(): void {
      this.initializeComponent()
  }

  initializeComponent() {
    this.componentRef = this.mycontainer.createComponent(this.data.component);
    this.loading = true

    setTimeout(() => {
      if (this.componentRef?.instance?.myForm) {
        this.formContainer = this.componentRef.instance.myForm
        this.formContainer.createEmbeddedView!(this.actionsTemplate);
      } else {
        this.mycontainer.createEmbeddedView(this.actionsTemplate)
      }
      this.loading = false
    }, 500);
    this.cdr.detectChanges();
  }
}
