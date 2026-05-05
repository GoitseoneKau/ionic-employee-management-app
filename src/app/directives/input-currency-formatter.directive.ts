import { Directive, ElementRef, EventEmitter, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[InputCurrencyFormatter]',
  standalone: true
})
export class InputCurrencyFormatterDirective {

  ngModelChange: EventEmitter<string> = new EventEmitter<string>();
  private moneyRegex = /^ZAR[1-9](?:\d{1,2})*(,\d{3})*$/;

  constructor(private element: ElementRef, @Optional() @Self() private ngControl: NgControl) {
    if (this.ngControl?.control) {
      this.ngControl.control.valueChanges?.subscribe(value => {

        if (value !== null && value !== undefined) {
          this.formatter(value.toString());
        }
      });
    }
  }


  formatter(value: string) {

    // Remove ZAR prefix if present
    value = value.replace(/^ZAR/, '');

    // Remove commas
    value = value.replace(/,/g, '');

    // Keep only digits
    value = value.replace(/[^\d]/g, '');

    // Prevent leading zeros
    value = value.replace(/^0+/, '');

    // If empty, clear field
    if (!value) {
      this.element.nativeElement.value = '';
      return;
    }

    // Add thousand separators
    let formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Add ZAR prefix
    const finalValue = `ZAR${formatted}`;



    // Validate final format
    if (this.moneyRegex.test(finalValue)) {
      this.element.nativeElement.value = finalValue;
      

    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: any) {
    const el = target as HTMLInputElement;
    let value: string = el.value;

    if(value){
      this.formatter(value);
      this.ngControl.control?.setValue(value);
    }

  }



  @HostListener('blur')
  onBlur() {

    let value = this.element.nativeElement.value;

    // If empty → default to ZAR1,000
    if (value === "" || value === 'ZAR') {
      this.element.nativeElement.value = 'ZAR1,000';
      return;
    }

    // Ensure valid format
    if (!this.moneyRegex.test(value)) {
      this.element.nativeElement.value = 'ZAR1,000';
    }
  }

}
