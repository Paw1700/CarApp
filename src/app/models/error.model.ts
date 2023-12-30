export class ErrorModel {
    constructor(
        public id: string,
        public type: string,
        public title: string,
        public desc?: string
    ) { }
}