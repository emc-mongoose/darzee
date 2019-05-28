import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";

/**
 * Latency chart for BasicChart component.
 */
export class MongooseLatencyChart implements MongooseChart {

    private readonly MAX_LATENCY_DATASET_INDEX = 0;
    private readonly MIN_LATENCY_DATASET_INDEX = 1;
    private readonly MEAN_LATENCY_DATASET_INDEX = 2;

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

        this.chartData = [maxLatencyDataset, minLatencyDataset, meanLatencyDataset];
        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {

        var maxLatencyMetricValues = [];
        var minLatencyMetricValues = [];
        var meanLatencyMetricValues = [];

        var latencyChartTimestamps: string[] = [];

        let maxLatencyMetricName = InternalMetricNames.LATENCY_MAX;
        let minLatencyMetricName = InternalMetricNames.LATENCY_MIN;
        let meanLatencyMetricName = InternalMetricNames.LATENCY_MEAN;
        metrics.forEach(metric => {
            let metricValue: string = metric.getValue();
            let metricName: string = metric.getName();
            switch (metricName) {
                case maxLatencyMetricName: {
                    maxLatencyMetricValues.push(metricValue);
                    break;
                }
                case minLatencyMetricName: {
                    let metricTimestamp: string = formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US');
                    latencyChartTimestamps.push(metricTimestamp);
                    minLatencyMetricValues.push(metricValue);
                    break;
                }
                case meanLatencyMetricName: {
                    meanLatencyMetricValues.push(metricValue);
                    break;
                }
            }
        });

        this.chartLabels = latencyChartTimestamps;
        this.chartData[this.MAX_LATENCY_DATASET_INDEX].setChartData(maxLatencyMetricValues);
        this.chartData[this.MIN_LATENCY_DATASET_INDEX].setChartData(minLatencyMetricValues);
        this.chartData[this.MEAN_LATENCY_DATASET_INDEX].setChartData(maxLatencyMetricValues);
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    private configureChartOptions() {
        const redColorRgb: string = MongooseChartDataset.MAX_CHART_DEFAULT_LINE_COLOR_RGB;
        this.chartData[this.MAX_LATENCY_DATASET_INDEX].setChartColor(redColorRgb);

        const yellowColorRgb: string = MongooseChartDataset.MEAN_CHART_DEFAULT_LINE_COLOR_RGBA;
        this.chartData[this.MEAN_LATENCY_DATASET_INDEX].setChartColor(yellowColorRgb);

        const greenColorRgb: string = MongooseChartDataset.MIN_CHART_DEFAULT_LINE_COLOR_RGB;
        this.chartData[this.MIN_LATENCY_DATASET_INDEX].setChartColor(greenColorRgb);

        let chartTitle: string = "Mongoose's operations latency, seconds";
        this.chartOptions.setChartTitle(chartTitle);
    }

}
