import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component,  ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import IState from 'src/app/interfaces/IState';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass'],
  imports: [CarouselModule, CommonModule, CloudinaryModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})  
export class CarouselComponent {
  @Input() states:Array<any> = [];
  @Input() customRef: any;
  @Input() activeStateIndex: number = 0;
  @Output() pageEvent = new EventEmitter<number>();
  myList: Array<any> = []
  img!: CloudinaryImage;
  img2!: CloudinaryImage;
  cld = new Cloudinary({
    cloud: {
      cloudName: 'dfmkh8oyt'
    }
  });
  constructor(private cdr: ChangeDetectorRef) {}
  
  teste = ['Item1', 'Item 2', 'Item 3'];

  projectedContentRef!: ElementRef;

  handlePageChange(e: CarouselPageEvent) {
    this.pageEvent.emit(e.page);
  }

  ngOnChanges({ states }: SimpleChanges) {
    if (states) {
      this.myList = this.states.map((state: IState)  => {
        const img = this.cld.image(state.mapId); 
        const name = state.name;
        return {img, name} 
      })
    }
  }
}
