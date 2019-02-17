import { Directive, Input, ElementRef } from '@angular/core';
import { MongooseRunStatus } from 'src/app/core/mongoose-run-status';

@Directive({
  selector: '[runStatus]'
})
export class RunStatusDirective {

  @Input('runStatus') color = MongooseRunStatus.Running;

  constructor(private element: ElementRef) { }

}
