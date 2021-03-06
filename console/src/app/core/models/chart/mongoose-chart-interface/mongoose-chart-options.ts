/**
 * Specifies options for BasicChart drawn via ChartJS library.
 */
export class MongooseChartOptions {

    private static readonly AMOUNT_OF_DIGITS_AFTER_DECIMAL_POINTS_LBL: number = 1;

    private static readonly DARK_ORANGE_COLOR_RGB: string = "rgb(255,140,0)";
    private static readonly RED_COLOR_RGB: string = "rgb(255, 0, 0)";
    private static readonly GREEN_COLOR_RGB: string = "rgb(46, 204, 113)";
    private static readonly MEDIUM_BLUE_COLOR_RGB: string = "rgb(0,0,205)";;

    public static readonly MEAN_VALUE_DEFAULT_COLOR_RGB = MongooseChartOptions.DARK_ORANGE_COLOR_RGB;
    public static readonly MAX_VALUE_DEFAULT_COLOR_RGB = MongooseChartOptions.RED_COLOR_RGB;
    public static readonly MIN_VALUE_DEFAUT_COLOR_RGB: string = MongooseChartOptions.GREEN_COLOR_RGB;
    public static readonly ELAPSED_TIME_AXES_DEFAULT_TAG: string = "Elapsed time since load step start, seconds"
    public static readonly SHOULD_ALLOW_NEGATIVE_VALUES_FOR_AXES: boolean = false;

    public static readonly LAST_VALUE_DEFAULT_COLOR_RGB: string = MongooseChartOptions.MEDIUM_BLUE_COLOR_RGB;

    private readonly MAXIMAL_AMOUNT_OF_LABELS_IN_CHART: number = 10;

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
            ticks: {
                beginAtZero: !MongooseChartOptions.SHOULD_ALLOW_NEGATIVE_VALUES_FOR_AXES
            }
        }],
        xAxes: [{
            scaleLabel: {
                display: true,
                labelString: MongooseChartOptions.DEAULT_Y_AXIS_TITLE
            },
            ticks: {
                beginAtZero: !MongooseChartOptions.SHOULD_ALLOW_NEGATIVE_VALUES_FOR_AXES,
                maxTicksLimit: this.MAXIMAL_AMOUNT_OF_LABELS_IN_CHART,
                callback: function (value, index, values) {
                    // NOTE: Converting OX axes labels.
                    return value.toExponential(MongooseChartOptions.AMOUNT_OF_DIGITS_AFTER_DECIMAL_POINTS_LBL) + " ";
                },
                maxRotation: 0
            }
        }]
    }

    public title: any = {
        display: true,
        text: this.MAXIMAL_AMOUNT_OF_LABELS_IN_CHART
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

    public isAxisScaledLogarithmically(axis: MongooseChartAxesType): boolean { 
        switch (axis) {
            case (MongooseChartAxesType.Y): {
                return (this.scales.yAxes[0].type == MongooseChartOptions.LOGARITHMIC_CHART_TYPE);
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
            case (MongooseChartAxesType.X): {
                return this.scales.xAxes[0];
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