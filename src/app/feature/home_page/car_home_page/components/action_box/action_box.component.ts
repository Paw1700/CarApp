import { Component, OnInit, inject } from "@angular/core";
import { style, trigger, animate, transition } from "@angular/animations";
import { ActionBoxState, CarHomePageService } from '../../car_home_page.service';
import { NgUnsubscriber } from '../../../../../util/ngUnsubscriber';
import { takeUntil } from 'rxjs';
import { AddRouteBox } from "./add_route/add_route.component";
import { TankUpBox } from "./tank_up/tank_up.component";
import { ChargeUpBox } from "./charge_up/charge_up.component";

@Component({
    selector: 'action-box',
    standalone: true,
    imports: [
        AddRouteBox,
        TankUpBox,
        ChargeUpBox
    ],
    templateUrl: './action_box.component.html',
    styleUrl: './action_box.component.scss',
    animations: [
        trigger('add_route_btn', [
            transition('* => void', [
                animate('350ms ease-in', style({
                    opacity: 0,
                    height: 0
                }))
            ]),
            transition('void => *', [
                style({opacity: 0, height: 0}),
                animate('350ms ease-out', style({
                    opacity: 1,
                    height: '*'
                }))
            ])
        ]),
        trigger('add_route_box', [
            transition('void => *', [
                style({
                    opacity: 0,
                    height: 0
                }),
                animate('350ms ease-out', style({
                    opacity: 1,
                    height: '*'
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-in', style({
                    height: 0
                }))
            ])
        ]),
        trigger('tank_up_box', [
            transition('void => *', [
                style({
                    opacity: 0,
                    height: 0
                }),
                animate('350ms ease-out', style({
                    opacity: 1,
                    height: '*'
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-in', style({
                    height: 0
                }))
            ])
        ]),
        trigger('charge_up_box', [
            transition('void => *', [
                style({
                    opacity: 0,
                    height: 0
                }),
                animate('350ms ease-out', style({
                    opacity: 1,
                    height: '*'
                }))
            ]),
            transition('* => void', [
                animate('350ms ease-in', style({
                    height: 0
                }))
            ])
        ])
    ]
})
export class ActionBox extends NgUnsubscriber implements OnInit{
    private PS = inject(CarHomePageService)
    box_state: ActionBoxState = 'closed'
    is_charging = false

    ngOnInit(): void {
        this.readBoxState()
    }

    changeCompState(state: ActionBoxState) {
        if (state === 'add_route' && this.is_charging) {
            this.PS.action_box_state$.next('charge_up')
        } else {
            this.PS.action_box_state$.next(state)
        }
    }

    private readBoxState() {
        this.PS.action_box_state$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( state => {
            this.box_state = state
        })
        this.PS.car$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe( car => {
            this.is_charging = car.energySourceData.electric.chargingPower !== null ? true : false
        })
    }
}