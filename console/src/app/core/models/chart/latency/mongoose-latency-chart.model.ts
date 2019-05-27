import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";


export class MongooseLatencyChart implements MongooseChart {

    private readonly MAX_LATENCY_DATASET_INDEX = 0;
    private readonly MIN_LATENCY_DATASET_INDEX = 1;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    isChartDataValid: boolean;
    mongooseChartDao: MongooseChartDao;
    shouldShiftChart: boolean;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart;

        let meanLatencyDataset = new MongooseChartDataset([], 'Mean latency');
        let maxLatencyDataset = new MongooseChartDataset([], 'Max latency');
        let minLatencyDataset = new MongooseChartDataset([], 'Min latency');

        this.chartData = [maxLatencyDataset, minLatencyDataset];
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {

        var maxLatencyMetricValues = [];
        var minLatencyMetricValues = [];

        var latencyChartTimestamps: string[] = [];

        let maxLatencyMetricName = InternalMetricNames.LATENCY_MAX;
        let minLatencyMetricName = InternalMetricNames.LATENCY_MIN;
        metrics.forEach(metric => {
            switch (metric.getName()) {
                case maxLatencyMetricName: {
                    maxLatencyMetricValues.push(metric.getValue());
                    latencyChartTimestamps.push(formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US'));

                    break;
                }
                case minLatencyMetricName: {
                    minLatencyMetricValues.push(metric.getValue());
                    break;
                }
            }
        })
        this.chartLabels = latencyChartTimestamps;
        this.chartData[this.MAX_LATENCY_DATASET_INDEX].setChartData(maxLatencyMetricValues);
        this.chartData[this.MIN_LATENCY_DATASET_INDEX].setChartData(minLatencyMetricValues);
    }


    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
