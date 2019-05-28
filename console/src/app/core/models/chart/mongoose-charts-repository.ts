import { MongooseDurationChart } from "./duration/mongoose-duration-chart.model";
import { MongooseChartOptions, MongooseChartAxesType } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseLatencyChart } from "./latency/mongoose-latency-chart.model";
import { MongooseThroughputChart } from "./throughput/mongoose-throughput-chart.model";
import { MongooseBandwidthChart } from "./bandwidth/mongoose-bandwidth-chart.model";
import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.model";

/**
 * Repository of different Mongoose metrics charts. 
 * Every chart is compatible with BasicChart component.
 */
export class MongooseChartsRepository {

    private readonly BASIC_MONGOOSE_CHART_LABELS: string[] = [];
    private readonly BASIC_MONGOOSE_CHART_TYPE: string = "line";
    // NOTE: determining whether the legend should be shown or not (depends on the boolean value)
    private readonly BASIC_MONGOOSE_CHART_LEGEND_MODE: boolean = true;

    private mongooseChartDao: MongooseChartDao;

    private durationChart: MongooseDurationChart;
    private latencyChart: MongooseLatencyChart;
    private thoughputChart: MongooseThroughputChart;
    private bandwidthChart: MongooseBandwidthChart;

    constructor(mongooseChartDao: MongooseChartDao) {
        this.mongooseChartDao = mongooseChartDao;
        this.setUpCharts();
    }

    // MARK: - Public 
    public getDurationChart(): MongooseDurationChart {
        return this.durationChart;
    }

    public getLatencyChart(): MongooseLatencyChart {
        return this.latencyChart;
    }

    public getThoughputChart(): MongooseThroughputChart {
        return this.thoughputChart;
    }

    public getBandwidthChart(): MongooseBandwidthChart {
        return this.bandwidthChart;
    }

    // MARK: - Private 

    private setUpCharts() {
        this.durationChart = this.createMongooseDurationChart();
        this.latencyChart = this.createMongooseLatencyChart();
        this.thoughputChart = this.createMongooseThroughtputChart();
        this.bandwidthChart = this.createMongooseBandwidthChart();
    }

    private createMongooseDurationChart(): MongooseDurationChart {
        let durationChartOptions: MongooseChartOptions = this.getLogarithmicOptionsForChart();
        return new MongooseDurationChart(durationChartOptions, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseLatencyChart(): MongooseLatencyChart {
        let latencyChartOptions: MongooseChartOptions = new MongooseChartOptions();
        return new MongooseLatencyChart(latencyChartOptions, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseThroughtputChart(): MongooseThroughputChart {
        let throughtputChartOptions: MongooseChartOptions = new MongooseChartOptions();
        return new MongooseThroughputChart(throughtputChartOptions, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseBandwidthChart(): MongooseBandwidthChart {
        let bandwidthChartOptions: MongooseChartOptions = this.getLogarithmicOptionsForChart();
        return new MongooseBandwidthChart(bandwidthChartOptions, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    /**
     * @returns MongooseChartOptions with logarithmic scaling on Y axes.
     */
    private getLogarithmicOptionsForChart(): MongooseChartOptions {
        let options: MongooseChartOptions = new MongooseChartOptions();
        const yAxisType = MongooseChartOptions.LOGARITHMIC_CHART_TYPE;
        options.setAxisChartType(yAxisType, MongooseChartAxesType.Y);
        return options;
    }
}
