import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    standalone: true,
    selector: 'NgUnsubscriber',
    template: ''
})
export class NgUnsubscriber implements OnDestroy {
    public ngUnsubscriber$ = new Subject<void>()

    ngOnDestroy(): void {
        this.ngUnsubscriber$.next()
        this.ngUnsubscriber$.complete()
    }
}