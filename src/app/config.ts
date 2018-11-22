export class Config {
    url: string;
    configuration: any;

    constructor(url: string, config: any) {
        this.url = url;
        this.configuration = config;
    }
}