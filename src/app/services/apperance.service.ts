import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LoadingScreenInputData } from "../UI/loading_screen/loading_screen.component";

@Injectable()
export class AppApperance {
    bottom_bar_state$ = new BehaviorSubject<BottomBarState>(new BottomBarState())
    dark_mode_state$ = new BehaviorSubject<boolean>(false)
    loading_screen_state$ = new BehaviorSubject<LoadingScreenInputData>({ show: false, loading_stage_text: '' })

    /**
     * Checking if at moment of running function browser is in dark mode
     * @returns If browser is in dark mode return true, otherwise false
     */
    checkIsDarkMode(): boolean {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true
        } else {
            return false
        }
    }

    /**
     * It's starts watching for dark mode state change in browser. Initially it also uses {@link checkIsDarkMode()} to set state for {@link dark_mode_state$} subject
     */
    watchForDarkModeChange(): void {
        this.dark_mode_state$.next(this.checkIsDarkMode())
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                this.dark_mode_state$.next(true)
            } else {
                this.dark_mode_state$.next(false)
            }
        })
    }

    /**
     * It's changes in app color themes depending on given color string if given only null it's reset app colors to default
     * @param theme_color color which will be used for theme color in app
     * @param accent_color color which will be used for accent color in app
     */
    setAppColor(theme_color: string | null, accent_color?: string) {
        if (theme_color === null || accent_color === undefined) {
            const style = getComputedStyle(document.documentElement)
            let color = style.getPropertyValue('--default-accent-color').trim()
            document.documentElement.style.setProperty('--accent-color', color)
            color = style.getPropertyValue('--app-theme').trim()
            document.documentElement.style.setProperty('--theme-color', color)
        } else {
            document.documentElement.style.setProperty('--theme-color', theme_color)
            document.documentElement.style.setProperty('--accent-color', accent_color)
        }
    }

    /**
     * It's changes status bar color in browser.
     * @param app_theme if true, function will use default app_theme color, otherwise you need to provide color string 
     * @param color string which will be setted for status bar
     */
    setStatusBarColor(app_theme: boolean, color?: string) {
        if (app_theme) {
            const style = getComputedStyle(document.documentElement)
            const appThemeColor = style.getPropertyValue('--app-theme').trim()
            document.querySelector("meta[name=theme-color]")?.setAttribute('content', appThemeColor)
        } else {
            if (color !== undefined) {
                document.querySelector("meta[name=theme-color]")?.setAttribute('content', color)
                //? CHECK IF IT WILL BE NEEDED LATER
                // setTimeout(() => {
                //     const settedCarTheme = document.querySelector("meta[name=theme-color]")?.getAttribute('content')?.trim()
                //     if (settedCarTheme !== color) {
                //         document.querySelector("meta[name=theme-color]")?.setAttribute('content', color)
                //     }
                // }, 350)
            } else {
                console.warn(`Didn't provided color for setStatusBarColor!`)
                this.setStatusBarColor(true)
            }
        }
    }

    /**
     * It's sets selected element in bottom bar
     * @param element specified element of bottom bar
     */
    setNavBarSelectedElement(element: BottomBarElements) {
        const state = this.bottom_bar_state$.value
        state.selected_element = element
        this.bottom_bar_state$.next(state)
    }

    /**
     * Sets car brand and name in nav bar 
     * @param state give car brand logo set and name or null for reset 
     */
    setChoosedCarBrandInNavBar(state: BottomBarCarBrandData | null) {
        const act_state = this.bottom_bar_state$.value
        act_state.choosed_car_brand = state
        this.bottom_bar_state$.next(act_state)
    }

    /**
     * It's hides or shows bottom bar
     * @param bool show or hide bar
     */
    hideNavBar(bool: boolean) {
        const state = this.bottom_bar_state$.value
        state.show = !bool
        this.bottom_bar_state$.next(state)
    }
}

export type BottomBarElements = 'selectedCar' | 'routes' | 'cars' | 'settings' | null

export class BottomBarState {
    constructor(
        public show = false,
        public selected_element: BottomBarElements = null,
        public choosed_car_brand: BottomBarCarBrandData | null = null
    ) { }
}

export type BottomBarCarBrandData = {
    name: string,
    image: {
        default: string,
        for_dark_mode: string | null
    }
}
