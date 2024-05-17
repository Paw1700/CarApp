export class AppVersion {
    constructor(
        public edition: number,
        public version: number,
        public patch: number,
        public compilation: number,
        public compilationIteration: string,
        public beta: boolean,
        public build: string,
        public important?: Feature[],
        public features?: Feature[],
        public fixes?: Feature[]
    ) { }
}

export class Feature {
    constructor(
        public id: number,
        public title: string,
        public description?: string
    ) { }
}

export class AppVersionIteration {
    constructor(
        public edition: number = 0,
        public version: number = 0,
        public patch: number = 0,
        public compilation: number = 0,
        public compilationIteration: string = '',
        public beta: boolean = false,
        public build: string = '0'
    ) { }
}

export type AppDataMajorVersions = '2.0.5' | '2.1.3' | '2.2.0' | 'actual'