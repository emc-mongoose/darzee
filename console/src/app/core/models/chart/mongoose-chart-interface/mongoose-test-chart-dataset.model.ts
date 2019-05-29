import { ChartPoint } from "./chart-point.model";

/**
 * Chart that tests point addition with ChartPoint class. TO BE DELETED
 */
export class MongooseTestChartDataset {
    // NOTE: Fields are public since they should match ng-chart2 library naming 
    // link: https://github.com/valor-software/ng2-charts

    /**
     * @param MEAN_CHART_DEFAULT_LINE_COLOR_RGBA - yellow - default color for MEAN line on charts.
     * @param MIN_CHART_DEFAULT_LINE_COLOR_RGBA - green - default color for MIN line on charts.
     * @param MAX_CHART_DEFAULT_LINE_COLOR_RGBA - red - default color for MAX line on charts.
     */
    public static readonly MEAN_CHART_DEFAULT_LINE_COLOR_RGBA = "rgba(247, 202, 24, 1)";
    public static readonly MIN_CHART_DEFAULT_LINE_COLOR_RGB = "rgb(255, 0, 0)";
    public static readonly MAX_CHART_DEFAULT_LINE_COLOR_RGB = "rgb(46, 204, 113)";

    private readonly ZERO_CURVE_LINE_TENSION = 0;
    private readonly BLACK_SOLID_COLOR_RGBA = "rgba(1, 1, 1, 1)";
    private readonly CLEAR_COLOR_RGBA = "rgba(0, 0, 0, 0)";
    private readonly CHART_LINE_WIDTH_PX = 1;
    private readonly CHART_POINT_RADIUS_PX = 0;

    public data: any[] = [];
    public points: ChartPoint[] = [];
    public label: string = "";

    public lineTension: number = this.ZERO_CURVE_LINE_TENSION;
    public fill: boolean = false;
    public backgroundColor: string = this.CLEAR_COLOR_RGBA;
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

    // MARK: - Public 

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
        this.data.push(point);
    }

    /**
     * Sets color to a specific chart. 
     * @param colorRgba color in RGB or RGBA format. E.g.: rgba(1, 1, 1, 1)
     */
    public setChartColor(colorRgba: string) {
        this.borderColor = colorRgba;
    }

    // MARK: - Private 

    private getPreviousValueFromDataset(dataset: MongooseTestChartDataset): string {
        let previosValueIndex = dataset.data.length - 1;
        let previosValue = dataset.data[previosValueIndex];
        return previosValue;
    }
}
