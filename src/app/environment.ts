// import { AppVersion } from "./models/app-version.model";

export class AppEnvironment {
    // public static readonly APP_VERSION: AppVersion = {
    //     edition: 2,
    //     version: 1,
    //     patch: 3,
    //     beta: false,
    //     compilation: 231217,
    //     compilationIteration: 'a',
    //     build: '',
    //     features: [
    //         {
    //             "id": 1,
    //             "title": "Auta hybrydowe i elektryczne",
    //             "description": "Dodano obsługę pojazdów hybrydowy oraz elektryczny"
    //         },
    //         {
    //             "id": 2,
    //             "title": "Poprawa desingu",
    //             "description": "Zmieniono wygląd interfejsu tras i auta, dodano scrollowanie aby ujrzeć dodatkowe funckje. Zmieniono interfejs dodawania pojazdu."
    //         }
    //     ],
    //     fixes: [
    //         {
    //             "id": 1,
    //             "title": "Czyszczenie oraz sprawdzenie integralności IGD",
    //             "description": "Napisano skrypt czyszczący IndexGeneratorData oraz jego integralność z danymi"
    //         }
    //     ]
    // }
    public static readonly APP_FINAL_VARIABLES = {
        combustion_engine_hybrid_usage_ratio: 6
    }
}