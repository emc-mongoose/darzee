import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';

@Directive({
  selector: '[runStatus]'
})
export class RunStatusDirective {

  @Input('directiveRunStatus') color = MongooseRunStatus.Running;

  constructor(private element: ElementRef) { }

  @HostListener('onmouseenter') addHightlight() { 
    console.log("Mouse entered");
    this.element.nativeElement.style.content = "ss";
    this.element.nativeElement.style.backgroundColor = this.color;
  }

}
