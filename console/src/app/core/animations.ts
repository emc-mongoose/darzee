import { trigger, transition, animate, style, useAnimation, animation, keyframes } from '@angular/animations';


// NOTE: Slide animations 
const SLIDE_ANIMATION_TIMING_MS = 50;
const slide = animation(
    animate(
        '{{ timing }}ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        keyframes([
            style({ transform: 'translateX(-100%)' }),
            style({ transform: 'translateX(0%)' }),
            
        ])
    ),
    { params: { timing: SLIDE_ANIMATION_TIMING_MS } }
)

// NOTE: Slide animation from left to right.
export let slideAnimation = trigger('slide',
    [transition('* => *', useAnimation(slide))]
)

// NOTE: Bounce animations 
const BOUNCE_IN_ANIM_TIMING_MS= 500;
const basicBounce = animation(
    animate(
        '{{ timing }}ms ease-out',
        keyframes([
            style({ opacity: 0, transform: 'scale3d(.5, .5, .5)', offset: 0 }),
            style({ transform: 'scale3d(1.2, 1.2, 1.2)', offset: 0.1 }),
            style({ transform: 'scale3d(.9, .9, .9)', offset: 0.4 }),
            style({
                transform: 'scale3d(1.03, 1.03, 1.03)',
                opacity: 0.8,
                offset: 0.6
            }),
            style({ transform: 'scale3d(.89, .89, .89)', offset: 0.8 }),
            style({ transform: 'scale3d(1, 1, 1)', opacity: 1, offset: 1 })
        ])
    ),
    { params: { timing: BOUNCE_IN_ANIM_TIMING_MS } }
);

export let bounceAnimation = trigger('bounce', 
[transition('void => *', useAnimation(basicBounce))]);
