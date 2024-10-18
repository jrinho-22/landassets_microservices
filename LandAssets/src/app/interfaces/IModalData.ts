import { Type } from "@angular/core";

export default interface IModalData {
    size: 'sm' | 'md' | 'lg',
    component: Type<any>,
    text: {title: string, action: string, close: string},
    action: () => {}
}