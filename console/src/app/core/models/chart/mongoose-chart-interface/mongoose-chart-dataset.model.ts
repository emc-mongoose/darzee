export class MongooseChartDataset { 
    // NOTE: Fields are public since they should match ng-chart2 library naming 
    // link: https://github.com/valor-software/ng2-charts
    public data = [];
    public label: string = "";

    constructor(data: any[], label: string) { 
        this.data = data; 
        this.label = label; 
    }
}