import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MetricValueType } from "../mongoose-chart-interface/metric-value-type";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MongooseDurationChart } from "../duration/mongoose-duration-chart.model";

/**
 * Latency chart for BasicChart component.
 */
export class MongooseLatencyChart implements MongooseChart {

    private readonly Y_AXIS_CHART_TITLE: string = "Milliseconds";
    private readonly X_AXIS_CHART_TITLE: string = MongooseChartOptions.ELAPSED_TIME_AXES_DEFAULT_TAG;

    private readonly MIN_LATENCY_DATASET_INDEX = 0;
    private readonly MAX_LATENCY_DATASET_INDEX = 1;
    private readonly MEAN_LATENCY_DATASET_INDEX = 2;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    isChartDataValid: boolean;
    shouldShiftChart: boolean;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart;

        let minLatencyDataset = new MongooseChartDataset([], 'Min latency');
        let maxLatencyDataset = new MongooseChartDataset([], 'Max latency');
        let meanLatencyDataset = new MongooseChartDataset([], 'Mean latency');

        this.chartData = [minLatencyDataset, maxLatencyDataset, meanLatencyDataset];
        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[], metricType: MetricValueType) {

        let chartLineIndex: number = undefined;
        switch (metricType) {
            case (MetricValueType.MEAN): {
                chartLineIndex = this.MEAN_LATENCY_DATASET_INDEX;
                break;
            }
            case (MetricValueType.MAX): {
                chartLineIndex = this.MAX_LATENCY_DATASET_INDEX;
                break;
            }
            case (MetricValueType.MIN): {
                chartLineIndex = this.MIN_LATENCY_DATASET_INDEX;
                break;
            }
            default: {
                throw new Error(`Unable to find specified metric type ${metricType} for Latency chart.`);

            }
        }

        this.chartData[chartLineIndex].data = metrics;

        let labels: string[] = [];
        for (var chartPoint of metrics) {
            let timestamp = chartPoint.getX() as unknown;
            labels.push(timestamp as string);
        }
        this.chartLabels = labels;
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    private configureChartOptions() {

        this.chartData[this.MAX_LATENCY_DATASET_INDEX].setChartColor(MongooseChartOptions.MAX_VALUE_DEFAULT_COLOR_RGB);
        this.chartData[this.MEAN_LATENCY_DATASET_INDEX].setChartColor(MongooseChartOptions.MEAN_VALUE_DEFAULT_COLOR_RGB);
        this.chartData[this.MIN_LATENCY_DATASET_INDEX].setChartColor(MongooseChartOptions.MIN_VALUE_DEFAUT_COLOR_RGB);

        let chartTitle: string = "Mongoose's operations latency, seconds";
        this.chartOptions.setChartTitle(chartTitle);

        this.configureAxes();
    }

    private configureAxes() {
        this.chartOptions.setAxisLabel(MongooseChartAxesType.Y, this.Y_AXIS_CHART_TITLE, true);
        this.chartOptions.setAxisLabel(MongooseChartAxesType.X, this.X_AXIS_CHART_TITLE, true);
    }

}
