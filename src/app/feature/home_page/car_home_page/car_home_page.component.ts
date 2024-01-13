import { Component, Input, OnDestroy, OnInit, inject } from "@angular/core";
import { Car } from "../../../models/car.model";
import { AppService } from "../../../service";
import { CarTitle } from "./components/car_title.component";
import { CommonModule } from "@angular/common";
import { EnergyState } from "./components/energy_state/energy_state.component";
import { energySourceStatus } from "../../../services/data/car.service";
import { RemainDistanceText } from "./components/remain_distance.component";
import { style, trigger, state, animate, transition } from "@angular/animations";
import { ActionBox } from "./components/action_box/action_box.component";
import { ScrollAbleBar } from "../../../UI/scroll_able_bar/scroll_able_bar.component";
import { Subject, takeUntil } from "rxjs";
import { CarHomePageService } from "./car_home_page.service";

@Component({
    selector: 'car-home-page',
    standalone: true,
    imports: [
        CommonModule,
        CarTitle,
        EnergyState,
        RemainDistanceText,
        ActionBox,
        ScrollAbleBar
    ],
    providers: [
        CarHomePageService
    ],
    templateUrl: './car_home_page.component.html',
    styleUrl: './car_home_page.component.scss',
    animations: [
        trigger('car_page', [
            state('false', style({
                opacity: 0
            })),
            state('true', style({
                opacity: 1
            })),
            transition('false => true', [
                animate('350ms ease-out')
            ])
        ]),
        trigger('car_title', [
            state('false', style({
                opacity: 1,
                height: '*'
            })),
            state('true', style({
                opacity: 0,
                height: 0
            })),
            transition('false => true', [
                animate('350ms ease-out')
            ]),
            transition('true => false', [
                animate('350ms ease-in')
            ])
        ]),
        trigger('car_image', [
            state('false', style({
                opacity: 1,
                height: '25%'
            })),
            state('true', style({
                opacity: 0,
                height: 0
            })),
            transition('false => true', [
                animate('350ms ease-out')
            ]),
            transition('true => false', [
                animate('350ms ease-in')
            ])
        ]),
        trigger('action_box_upper_options', [
            transition('void => *', [
                style({
                    height: 0
                }),
                animate('350ms ease-out', style({
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
export class CarHomePage implements OnInit, OnDestroy{
    @Input() carID = ''
    private APP = inject(AppService)
    private PS = inject(CarHomePageService)
    private unsubscriber$ = new Subject<void>()
    car = new Car()
    car_energy_state = new energySourceStatus()
    diff_energy_state = new energySourceStatus()
    show_page = false
    add_route_open = false
    tank_up_text = ''
    charge_up_text = ''

    async ngOnInit(): Promise<void> {
        this.readActionBoxState()
        this.readCarDataState()
        await this.PS.getCarData(this.carID)
        this.show_page = true
        this.APP.APPERANCE.setStatusBarColor(false, this.car.color.theme)
    }

    ngOnDestroy(): void {
        this.APP.APPERANCE.setStatusBarColor(true)
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    closeActionBox() {
        this.PS.action_box_open$.next(false)
    }

    initSaveAction() {
        this.PS.saveAction()
        .then(() => {
            this.closeActionBox()
        })
    }

    openOtherBoxOption(option: 'tank-up' | 'charge_up') {
        switch(option) {
            case "tank-up":
                this.PS.action_box_state$.next('tank_up')
                break
            case "charge_up":
                this.PS.action_box_state$.next('charge_up')
                break
        }
    }

    private readActionBoxState() {
        this.PS.action_box_open$.pipe(takeUntil(this.unsubscriber$)).subscribe( bool => {
            this.add_route_open = bool
        })
    }

    private readCarDataState() {
        this.PS.car$.pipe(takeUntil(this.unsubscriber$)).subscribe( car => {
            this.car = car
        })
        this.PS.car_energy_state$.pipe(takeUntil(this.unsubscriber$)).subscribe( energy_state => {
            this.car_energy_state = energy_state
            if (energy_state.electric.level < 100 && (this.car.type === 'Electric' || this.car.type === 'Hybrid')) {
                this.charge_up_text = 'NAŁADUJ'
            } else {
                this.charge_up_text = ''
            }
            if (energy_state.fuel.level < 100 && (this.car.type === 'Combustion' || this.car.type === 'Hybrid')) {
                this.tank_up_text = 'TANKUJ'
            } else {
                this.tank_up_text = ''
            }
        })
        this.PS.diff_energy_state$.pipe(takeUntil(this.unsubscriber$)).subscribe( diff_energy_state => {
            this.diff_energy_state = diff_energy_state
        })
    }
}