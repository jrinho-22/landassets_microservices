import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass'],
  standalone: true,
  imports: [CommonModule, IconButtonComponent]
})
export class PaginationComponent {
  @Input() collections: Array<any> = [];
  @Input() itemsLengthAllowed: number = 10;
  pagination!: number
  collectionSplited: Array<Array<any>> = [];
  activePage = new BehaviorSubject(1)
  leftDots = false
  rightDots = false
  localLoading = false
  @Output() currentCollection = new EventEmitter();
  @Output() loading = new EventEmitter();

  handleClick(page: number) {
    this.loading.emit(true);
    this.localLoading = true
    setTimeout(() => {
      this.currentCollection.emit(this.collectionSplited[page - 1]);
      this.activePage.next(page)
      this.loading.emit(false);
      this.localLoading = false
    }, 500);
  }

  handleArrow(direction: 'left' | 'right') {
    this.loading.emit(true);
    setTimeout(() => {
      if (direction == 'left') {
        this.currentCollection.emit(this.collectionSplited[0])
        this.activePage.next(1)
      } else {
        this.currentCollection.emit(this.collectionSplited[this.pagination - 1])
        this.activePage.next(this.pagination)
      }
      this.loading.emit(false);
    }, 500);

  }

  generateNumberArray() {
    let numberArr = []
    for (let index = 1; index <= this.pagination; index++) {
      numberArr.push(index)
    }
    if (numberArr.length > 5) {
      const activePageValue = this.activePage.getValue()
      if (activePageValue == 1) {
        return [activePageValue, activePageValue + 1, activePageValue + 2, activePageValue + 3, activePageValue + 4]
      }
      if (activePageValue == 2) {
        return [activePageValue - 1, activePageValue, activePageValue + 1, activePageValue + 2, activePageValue + 3]
      }
      if (activePageValue == this.pagination - 1) {
        return [activePageValue - 3, activePageValue - 2, activePageValue - 1, activePageValue, activePageValue + 1]
      }
      if (activePageValue == this.pagination) {
        return [activePageValue - 4, activePageValue - 3, activePageValue - 2, activePageValue - 1, activePageValue]
      }
      return [activePageValue - 2, activePageValue - 1, activePageValue, activePageValue + 1, activePageValue + 2]
    }
    return numberArr
  }

  subscribeToPageChange() {
    this.activePage.subscribe(page => {
      if (page > 3) {
        this.leftDots = true
      } else this.leftDots = false
      if (page < this.pagination - 2) {
        this.rightDots = true
      } else this.rightDots = false
    }
    )
  }

  splitCollection() {
    const newCollections = [...this.collections]
    const length = newCollections.length
    this.pagination = Math.ceil(length / this.itemsLengthAllowed)
    for (let index = 0; index < this.pagination; index++) {
      this.collectionSplited.push([])
      for (let index2 = 0; index2 < this.itemsLengthAllowed; index2++) {
        if (newCollections.length) {
          this.collectionSplited[index].push(newCollections.shift())
        }
      }
    }
      this.currentCollection.emit(this.collectionSplited[0]);
  }

  ngOnChanges({ collections }: SimpleChanges) {
    if (collections) {
      this.splitCollection()
    }
    if (this.pagination > 5) this.subscribeToPageChange()
  }
}
