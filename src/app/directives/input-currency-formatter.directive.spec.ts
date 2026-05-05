import { TestBed } from '@angular/core/testing';
import { InputCurrencyFormatterDirective } from './input-currency-formatter.directive';

describe('InputCurrencyFormatterDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      declarations: [InputCurrencyFormatterDirective]
    });
    const fixture = TestBed.createComponent(InputCurrencyFormatterDirective);
    expect(fixture).toBeTruthy();
  });
});
