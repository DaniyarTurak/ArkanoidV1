import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ccColorChange]',
})
export class ColorChangeDirective {
  @Input()
  get ccColorChange(): number {
    return this._colorChange;
  }

  set ccColorChange(_colorChange: number) {
    this._colorChange = _colorChange;
    this.customFunction();
  }

  private _colorChange = 1;

  // DI => token= это у нас тип(например ElementRef)
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  customFunction(): void {
    switch (this._colorChange) {
      case 3:
        this.renderer.setStyle(
          this.el.nativeElement,
          'backgroundColor',
          'purple'
        );
        break;
      case 2:
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'red');
        break;
      default:
        this.renderer.setStyle(
          this.el.nativeElement,
          'backgroundColor',
          'blue'
        );
    }
  }
}
