import { AppVersion } from "./models/app-version.model";

export class AppEnvironment {
    public static readonly APP_VERSION: AppVersion = {
        edition: 2,
        version: 2,
        patch: 0,
        compilation: 240102,
        compilationIteration: 'x',
        beta: false,
        build: '',
        features: [
            {
                "id": 1,
                "title": "Przejście na Angular 17",
                "description": "Kod aplikacji został ponownie napisany używająć nowych możliwości w Angular 17"
            },
            {
                "id": 2,
                "title": "Poprawa desingu",
                "description": "Zmieniono wygląd interfejsu tras i auta, dodano scrollowanie aby ujrzeć dodatkowe funckje. Zmieniono interfejs dodawania pojazdu."
            }
        ]
    }
    public static readonly APP_FINAL_VARIABLES = {
        combustion_engine_hybrid_usage_ratio: 6
    }
}