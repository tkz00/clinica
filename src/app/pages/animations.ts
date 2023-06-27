import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
    state('void', style({ opacity: 0 })),
    transition(':enter, :leave', [
        animate(600, style({ opacity: 1 }))
    ])
]);

export const slideInOutAnimation = trigger('slideInOut', [
    state('void', style({ transform: 'translateX(-100%)' })),
    transition(':enter', [
        animate('0.3s ease-in', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
    ])
]);

export const slideInOutFromBottomAnimation = trigger('slideInOutFromBottom', [
    state('void', style({ transform: 'translateY(200%)' })),
    transition(':enter', [
        animate('0.5s ease-in', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateY(-200%)' }))
    ])
]);