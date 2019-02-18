import { trigger, state, transition, animate, style } from '@angular/animations';

export let slideAnimation = trigger('slide', [
    transition('* => *', [
        style({transform: 'translateX(-100%)'}),
        animate('150ms ease-in', style({transform: 'translateX(0%)'}))
    ]) 
  ])