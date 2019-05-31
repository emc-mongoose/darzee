/**
 * Specifies options for BasicChart drawn via ChartJS library.
 */
export class MongooseChartOptions {

    /**
     * @param CHART_DEFAULT_TYPE specifies default type of chart drawn via ChartJS library. "Linear" is a default value.
     */
    public static readonly CHART_DEFAULT_TYPE = "linear";
    public static readonly LOGARITHMIC_CHART_TYPE = "logarithmic";
    public static readonly DEAULT_Y_AXIS_TITLE = ""; 
    // NOTE: Fields are public since they should match ng-chart2 library naming 
    // link: https://github.com/valor-software/ng2-charts
    public scaleShowVerticalLines: boolean = false;
    public responsive: boolean = true;
    public responsiveAnimationDuration: number = 0;
    public animation: any = {
        duration: 0
    };

    public scales: any = {
        yAxes: [{
            type: MongooseChartOptions.CHART_DEFAULT_TYPE,
            scaleLabel: {
                display: true,
                labelString: MongooseChartOptions.DEAULT_Y_AXIS_TITLE
              },
        }]
    }

    public title: any = {
        display: true,
        text: ''
    }

    constructor(shouldScaleShowVerticalLines: boolean = false, isResponsive: boolean = true) {
        this.scaleShowVerticalLines = shouldScaleShowVerticalLines;
        this.responsive = isResponsive;
    }

    /**
     * 
     * @param type specified the type of a certain @param axis.
     * @throws Error if non-existing @param axis has been passed as an argument.
     */
    public setAxisChartType(type: string, axis: MongooseChartAxesType) {
        switch (axis) {
            case (MongooseChartAxesType.Y): {
                this.scales.yAxes[0].type = type;
                break;
            }
            default: {
                throw new Error(`requested axis "${axis}" hasn't been found.`);
            }
        }
    }

    /**
     * Title will be displayed above the chart.
     * @param title a title of chart. 
     */
    public setChartTitle(title: string) {
        this.title.text = title;
    }

    public setAxisLabel(axis: MongooseChartAxesType, label: string, shouldDisplay: boolean) { 
        const axesInstance: any = this.getAxis(axis);
        axesInstance.scaleLabel.labelString = label;
        axesInstance.scaleLabel.shouldDisplay = shouldDisplay;
    }

    private getAxis(axis: MongooseChartAxesType): any { 
        switch (axis) {
            case (MongooseChartAxesType.Y): {
                return this.scales.yAxes[0]
            }
            default: {
                throw new Error(`requested axis "${axis}" hasn't been found.`);
            }
        }
    }
}

export enum MongooseChartAxesType {
    X = "x",
    Y = "y"
}