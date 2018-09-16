/**
 * Credit goes to Johannes Hoppe
 * https://blog.johanneshoppe.de/2016/10/angular-2-how-to-use-date-input-controls-with-angular-forms/
 * Adjusted to use Renderer2
 */

import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true,
};

@Directive({
  selector: '[useValueAsDate]',
  providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessorDirective implements ControlValueAccessor {

  @HostListener('input', ['$event.target.valueAsDate'])
  public onChange = (_: any) => { }
  @HostListener('blur', [])
  public onTouched = () => { }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  public writeValue(value: Date): void {
    if (value && value instanceof Date) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'valueAsDate', value);
    } else {
       this.renderer.setProperty(this.elementRef.nativeElement, 'valueAsDate', null);
    }
  }

  public registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  public registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  public setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
