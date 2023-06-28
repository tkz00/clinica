import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[link]'
})
export class LinkDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'text-decoration', 'underline');
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#0d6efd');
    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
  }
}
