export class MongooseChartOptions {

    // NOTE: Fields are public since they should match ng-chart2 library naming 
    // link: https://github.com/valor-software/ng2-charts
    public scaleShowVerticalLines: boolean = false;
    public responsive: boolean = true;
    public responsiveAnimationDuration: number = 0;
    public animation: any = {
        duration: 0
    }
    public scales: any = {
        yAxes: [{
            type: 'logarithmic'
        }]
    }

    constructor(shouldScaleShowVerticalLines: boolean = false, isResponsive: boolean = true) {
        this.scaleShowVerticalLines = shouldScaleShowVerticalLines;
        this.responsive = isResponsive;
    }
}
