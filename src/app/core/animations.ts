import { trigger, state, transition, animate, style } from '@angular/animations';

export let slideAnimation = trigger('slide', [

    // state('left', style({ transform: 'translateX(0)' })),
    // state('right', style({ transform: 'translateX(-50%)' })),
    transition('* => *', [
      style({ transform: 'translateX(0)'}),
      animate(300, style({ transform: 'translateX(-50%)' }))
    ]) 
  ])