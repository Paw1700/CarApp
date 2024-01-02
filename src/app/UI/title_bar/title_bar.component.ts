import { Component, Input, OnInit, inject } from "@angular/core";
import { takeUntil } from "rxjs";
import { AppService } from "../../service";
import { NgUnsubscriber } from "../../util/ngUnsubscriber";

@Component({
    selector: 'title-bar',
    standalone: true,
    templateUrl: './title_bar.component.html',
    styleUrl: './title_bar.component.scss'
})
export class TitleBar extends NgUnsubscriber implements OnInit {
    @Input({required: true}) title_content = ''
    @Input({required: true}) title_mode: "BIG" | "SMALL" = "BIG"
    // @Input({required: true}) show_return_arrow = true

    private APP = inject(AppService)

    protected image_color_mode: 'black' | 'white' = 'black'

    ngOnInit(): void {
        this.APP.APPERANCE.dark_mode_state$.pipe(takeUntil(this.ngUnsubscriber$))
            .subscribe(
                darkMode => {
                    if(darkMode) {
                        this.image_color_mode = 'white'
                    } else {
                        this.image_color_mode = 'black'
                    }
                }
            )
    }
}