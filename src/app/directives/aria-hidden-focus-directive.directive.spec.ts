import { AriaHiddenFocusDirective } from './aria-hidden-focus-directive.directive';
import { NgZone } from '@angular/core';

describe('AriaHiddenFocusDirective', () => {
  it('should create an instance', () => {
    const directive = new AriaHiddenFocusDirective(new NgZone({}));
    expect(directive).toBeTruthy();
  });
});
