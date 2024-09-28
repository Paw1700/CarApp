import { AppVersion } from "./models/app_version.model";

export class AppEnvironment {
    public static readonly APP_VERSION: AppVersion = {
        edition: 2,
        version: 3,
        patch: 0,
        compilation: 0,
        compilationIteration: 'x',
        beta: true,
        build: 'GM Build 2',
        features: [
            {
                "id": 1,
                "title": "Symulowane ładowanie auta",
                "description": "Teraz możesz zasymulować ładowanie auta"
            },
            {
                "id": 2,
                "title": "Zapamiętywanie wszystkich tras",
                "description": "Od teraz aplikacja nie usuwa tras przy tankowaniu lub ładowaniu."
            }
        ]
    }
    public static readonly APP_FINAL_VARIABLES = {
        combustion_engine_hybrid_usage_ratio: 6
    }
}