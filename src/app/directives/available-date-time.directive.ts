import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[availableDateTime]'
})
export class AvailableDateTimeDirective {

  @Input('availableDateTime') isAvailable: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.isAvailable) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', '#73be48');
    }
  }
}
