import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'stringDate',
    standalone: true
})
export class StringDate implements PipeTransform {
    transform(value: string) {
        const dateOfValue = new Date(value)
        let month = ''
        let day = ''
        switch (dateOfValue.getMonth()) {
            case 0:
                month = 'stycznia'
                break
            case 1:
                month = 'lutego'
                break
            case 2:
                month = 'marca'
                break
            case 3:
                month = 'kwietnia'
                break
            case 4:
                month = 'maja'
                break
            case 5:
                month = 'czerwca'
                break
            case 6:
                month = 'lipca'
                break
            case 7:
                month = 'sierpnia'
                break
            case 8:
                month = 'września'
                break
            case 9:
                month = 'paźdzernika'
                break
            case 10:
                month = 'listopada'
                break
            case 11:
                month = 'grudnia'
                break
        }
        switch (dateOfValue.getDay()) {
            case 0:
                day = 'niedziela'
                break
            case 1:
                day = 'poniedziałek'
                break
            case 2:
                day = 'wtorek'
                break
            case 3:
                day = 'środa'
                break
            case 4:
                day = 'czwartek'
                break
            case 5:
                day = 'piątek'
                break
            case 6:
                day = 'sobota'
                break

        }
        return dateOfValue.getDate() + " " + month + " " + dateOfValue.getFullYear() + ", " + day
    }
}