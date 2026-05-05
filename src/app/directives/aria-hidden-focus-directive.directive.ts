import { Directive, NgZone } from '@angular/core';

@Directive({
  selector: '[AriaHiddenFocus]',
  standalone: true
})
export class AriaHiddenFocusDirective {

  private observer!: MutationObserver;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => this.checkActiveElement());
      this.observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['aria-hidden'],
      });
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private checkActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    if (active && this.isInsideHiddenElement(active)) {
      active.blur(); // remove focus from hidden element
    }
  }

  private isInsideHiddenElement(el: HTMLElement): boolean {
    let current: HTMLElement | null = el;
    while (current) {
      console.log(current);
      if (current.getAttribute('aria-hidden') === 'true') return true;
      current = current.parentElement;
    }
    return false;
  }

}
