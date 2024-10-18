import { FormGroup } from "@angular/forms";

export default interface IFormParent<T> {
    submit?(): void,
    beforeLoad?(data: T): Record<string, any>,
    beforePost?(data: FormGroup): FormGroup | FormData | Record<string, any>,
}