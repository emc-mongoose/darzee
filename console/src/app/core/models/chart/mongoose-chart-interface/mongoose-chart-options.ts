/**
 * Specifies options for BasicChart drawn via ChartJS library.
 */
export class MongooseChartOptions {

    /**
     * @param CHART_DEFAULT_TYPE specifies default type of chart drawn via ChartJS library. "Linear" is a default value.
     */
    public static readonly CHART_DEFAULT_TYPE = "linear";
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
            type: 'logarithmic'
        }],
        xAxes: [{
            type: "linear"
        }]
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
            case (MongooseChartAxesType.X): { 
                this.scales.xAxes.type = type; 
                break;
            }
            case (MongooseChartAxesType.Y): { 
                this.scales.yAxes.type = type; 
                break;
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