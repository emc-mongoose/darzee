import { MongooseDurationChart } from "./duration/mongoose-duration-chart.model";
import { MongooseChartOptions, MongooseChartAxesType } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseLatencyChart } from "./latency/mongoose-latency-chart.model";
import { MongooseThroughputChart } from "./throughput/mongoose-throughput-chart.model";
import { MongooseBandwidthChart } from "./bandwidth/mongoose-bandwidth-chart.model";
import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.model";

export class MongooseChartsRepository {

    private readonly BASIC_MONGOOSE_CHART_OPTIONS: MongooseChartOptions = new MongooseChartOptions();
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
        let options: MongooseChartOptions = new MongooseChartOptions();
        const yAxisType = MongooseChartOptions.LOGARITHMIC_CHART_TYPE;
        options.setAxisChartType(yAxisType, MongooseChartAxesType.Y);
        return new MongooseDurationChart(options, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseLatencyChart(): MongooseLatencyChart {
        return new MongooseLatencyChart(this.BASIC_MONGOOSE_CHART_OPTIONS, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseThroughtputChart(): MongooseThroughputChart {
        return new MongooseThroughputChart(this.BASIC_MONGOOSE_CHART_OPTIONS, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }

    private createMongooseBandwidthChart(): MongooseBandwidthChart {
        return new MongooseBandwidthChart(this.BASIC_MONGOOSE_CHART_OPTIONS, this.BASIC_MONGOOSE_CHART_LABELS, this.BASIC_MONGOOSE_CHART_TYPE, this.BASIC_MONGOOSE_CHART_LEGEND_MODE, this.mongooseChartDao);
    }
}
