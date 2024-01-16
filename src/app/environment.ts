import { AppVersion } from "./models/app_version.model";

export class AppEnvironment {
    public static readonly APP_VERSION: AppVersion = {
        edition: 2,
        version: 2,
        patch: 0,
        compilation: 0,
        compilationIteration: 'x',
        beta: true,
        build: '2',
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
            },
            {
                "id": 3,
                "title": "Zmiana wyglądu strony głównej",
                "description": "Zmieniono wygląd ekranu głównemu auta i wykorzystano obsługę przesunięcie w przyciski dodania trasy aby pokazać schowane opcje."
            }
        ]
    }
    public static readonly APP_FINAL_VARIABLES = {
        combustion_engine_hybrid_usage_ratio: 6
    }
}