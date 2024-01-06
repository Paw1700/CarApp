import { Component, OnInit, inject } from "@angular/core";
import { SelectInputComponent } from "../../../../UI/forms/select_input/select_input.component";
import { AppService } from "../../../../service";
import { CarBrand } from "../../../../models/car_brand.model";
import { TextInputComponent } from "../../../../UI/forms/text_input/text_input.component";
import { ButtonComponent, ButtonTypes } from "../../../../UI/button/button.component";
import { NumberInputComponent } from "../../../../UI/forms/number_input/number_input.component";
import { CombustionEngineCredentials } from "./components/combustion_engine_credentials/combustion_engine_credentials.component";
import { ElectricEngineCredentials } from "./components/electric_engine_credentials/electric_engine_credentials.component";
import { CarCreatePageService } from "../../create_car_page.service";
import { CarDBModel, CarType } from "../../../../models/car.model";
import { NgUnsubscriber } from "../../../../util/ngUnsubscriber";
import { takeUntil } from "rxjs";
import { ColorPicker } from "./components/color_picker.component";
import { DatePicker } from "./components/date_picker.component";
import { InsOpt, InsuranceOptionsPicker } from "./components/insurance_picker.component";
import { Loader } from "../../../../UI/loaders/loader.component";

@Component({
    selector: 'car-credentials',
    standalone: true,
    imports: [SelectInputComponent, TextInputComponent, ButtonComponent, NumberInputComponent, CombustionEngineCredentials, ElectricEngineCredentials, ColorPicker, DatePicker, InsuranceOptionsPicker, Loader],
    templateUrl: './car_credentials.component.html',
    styleUrl: './car_credentials.component.scss'
})
export class CarCredentialsComponent extends NgUnsubscriber implements OnInit {
    private PS = inject(CarCreatePageService)
    readonly car_types = [{ name: 'Hybrydowe', value: 'H' }, { name: 'Spalinowe', value: 'C' }, { name: 'Elektryczne', value: 'E' }]
    readonly gearbox_types = [{ name: 'Automatyczna', value: 'AT' }, { name: 'Automatyczna bezstopniowa', value: 'AT-CVT' }, { name: 'Manualna', value: 'MT' }]
    readonly drive_types = [{ name: 'Na cztery koła', value: 'AWD' }, { name: 'Na przednie koła', value: 'FWD' }, { name: 'Na tylnie koła', value: 'RWD' }]
    APP = inject(AppService)
    brands: CarBrand[] = []
    data_fetching = false
    btn_type: ButtonTypes = 'accent'

    car_data: CarDBModel = new CarDBModel()
    choosed_brand_index = -1
    actual_mileage: number | null = null
    mileage_at_review: number | null = null
    select_car_type_index = -1
    select_gearbox_type_index = -1
    select_drive_type_index = -1
    ins_opts: InsOpt = { AC: false, NWW: false, Assistance: false }

    async ngOnInit() {
        await this.getCarBrands()
        this.readCarState()
    }

    handleInputChange(destination: InputPayloadDestinations, payload: any) {
        switch (destination) {
            case "car_brand":
                if (payload !== null) {
                    this.car_data.brandId = payload.id
                } else {
                    this.car_data.brandId = ''
                }
                break
            case "model_name":
                this.car_data.model = payload
                break
            case "color_theme":
                this.car_data.color.theme = payload
                break
            case "color_accent":
                this.car_data.color.accent = payload
                break
            case "actual_mileage":
                this.car_data.mileage.actual = payload
                break
            case "end_review":
                this.car_data.tech_review_ends = payload
                break
            case "mileage_at_review":
                this.car_data.mileage.at_review = payload
                break
            case 'ins_comp_name':
                this.car_data.insurance.name = payload
                break
            case 'ins_start_date':
                this.car_data.insurance.startDate = payload
                break
            case 'ins_end_date':
                this.car_data.insurance.endsDate = payload
                break
            case "ins_opt":
                this.ins_opts = payload
                this.car_data.insurance.options.AC = this.ins_opts.AC
                this.car_data.insurance.options.Assistance = this.ins_opts.Assistance
                this.car_data.insurance.options.NWW = this.ins_opts.NWW
                break
            case "car_type":
                switch (payload.value) {
                    case 'H':
                        this.car_data.type = 'Hybrid'
                        break
                    case 'C':
                        this.car_data.type = 'Combustion'
                        break
                    case 'E':
                        this.car_data.type = 'Electric'
                        break
                }
                break
            case "gearbox_type":
                this.car_data.gearbox.type = payload.value
                break
            case "gearbox_gears_amount":
                this.car_data.gearbox.gearsAmount = payload
                break
            case "drive_type":
                this.car_data.drive_type = payload.value
                break
        }
        this.PS.car_data$.next(this.car_data)
    }

    saveCar() {
        this.data_fetching = true
        setTimeout(() => {
            this.PS.saveCar()
            .then(() => {
                this.data_fetching = false
                this.APP.navigate('carsList')
            })
            .catch((err) => {
                this.data_fetching = false
                this.btn_type = 'error'
                setTimeout(() => {
                    this.btn_type = 'accent'
                }, 2000)
            })
        }, 1250);
    }

    private async getCarBrands() {
        this.brands = await this.APP.DATA.CAR_BRAND.getAll()
    }

    private readCarState() {
        this.PS.car_data$.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(car => {
            this.car_data = car
            this.choosed_brand_index = this.brands.findIndex(brand => brand.id === car.brandId)
            if (car.mileage.actual !== null) {
                this.actual_mileage = car.mileage.actual
            }
            if (car.mileage.at_review !== null) {
                this.mileage_at_review = car.mileage.at_review
            }
            this.ins_opts.AC = this.car_data.insurance.options.AC
            this.ins_opts.Assistance = this.car_data.insurance.options.Assistance
            this.ins_opts.NWW = this.car_data.insurance.options.NWW
            switch (this.car_data.type) {
                case "Combustion":
                    this.select_car_type_index = 1
                    break
                case "Electric":
                    this.select_car_type_index = 2
                    break
                case "Hybrid":
                    this.select_car_type_index = 0
                    break
                case null:
                    this.select_car_type_index = -1
                    break
            }
            switch (this.car_data.gearbox.type) {
                case "AT":
                    this.select_gearbox_type_index = 0
                    break
                case "AT-CVT":
                    this.select_gearbox_type_index = 1
                    break
                case "MT":
                    this.select_gearbox_type_index = 2
                    break
                case null:
                    this.select_gearbox_type_index = -1
                    break
            }
            switch (this.car_data.drive_type) {
                case "AWD":
                    this.select_drive_type_index = 0
                    break
                case "FWD":
                    this.select_drive_type_index = 1
                    break
                case "RWD":
                    this.select_drive_type_index = 2
                    break
                case null:
                    this.select_drive_type_index = -1
                    break
            }
        })
    }
}

export type InputPayloadDestinations = 'car_brand' | 'model_name' | 'color_theme' | 'color_accent' | 'actual_mileage' | 'end_review' | 'mileage_at_review' | 'ins_comp_name' | 'ins_start_date' | 'ins_end_date' | 'ins_opt' | 'car_type' | 'gearbox_type' | 'gearbox_gears_amount' | 'drive_type'