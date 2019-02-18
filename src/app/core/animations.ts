import { trigger, transition, animate, style } from '@angular/animations';

// NOTE: Slide animation from left to right.
export let slideAnimation = trigger('slide', [
    transition('* => *', [
        style({transform: 'translateX(-100%)'}),
        animate('50ms ease-in', style({transform: 'translateX(0%)'}))
    ]) 
  ])