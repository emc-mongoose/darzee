import { ChartPoint } from "./chart-point.model";

export class MongooseChartDataset {
    // NOTE: Fields are public since they should match ng-chart2 library naming 
    // link: https://github.com/valor-software/ng2-charts

    private readonly ZERO_CURVE_LINE_TENSION = 0;
    private readonly BLACK_SOLID_COLOR_RGBA = "rgba(1,1,1,1)";
    private readonly CHART_LINE_WIDTH_PX = 1;
    private readonly CHART_POINT_RADIUS_PX = 0;

    public data: any[] = [];
    public points: ChartPoint[] = []; 
    public label: string = "";

    public lineTension: number = this.ZERO_CURVE_LINE_TENSION;
    public fill: boolean = false;
    public backgroundColor: string = this.BLACK_SOLID_COLOR_RGBA;
    public borderColor: string = this.BLACK_SOLID_COLOR_RGBA;
    public borderWidth: number = this.CHART_LINE_WIDTH_PX;
    public pointRadius: number = this.CHART_POINT_RADIUS_PX;
    public options: Object = {
        responsiveAnimationDuration: 0,
        animation: {
          duration: 100
        }
    }
    

    constructor(data: any[], label: string) {
        this.data = data;
        this.label = label;
    }

    public appendDatasetWithNewValue(newValue: string) {
        const emptyValue = "";
        if (newValue == emptyValue) {
            newValue = this.getPreviousValueFromDataset(this);
        }
        this.data.push(newValue);
    }

    public setChartData(data: any[]) { 
        this.data = data;
    }

    public addPoint(x: number, y: number) { 
        let point = new ChartPoint(x, y);
        // this.points.push(point);
        this.data.push(point);
    }

    private getPreviousValueFromDataset(dataset: MongooseChartDataset): string {
        let previosValueIndex = dataset.data.length - 1;
        let previosValue = dataset.data[previosValueIndex];
        return previosValue;
    }
}
