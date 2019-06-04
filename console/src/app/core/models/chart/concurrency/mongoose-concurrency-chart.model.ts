import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { NumericMetricValueType } from "../mongoose-chart-interface/numeric-metric-value-type";

/**
 * Concurrency chart for BasicChart component.
 */
export class MongooseConcurrencyChart implements MongooseChart {

    /**
     * Make sure to update @param LAST_CONCURRENT_METRICS_DATASET_INDEX, @param MEAN_CONCURRENT_METRICS_DATASET_INDEX in case ...
     * ... @param chartData order changes.
     * @param LAST_CONCURRENT_METRICS_DATASET_INDEX index of data array for "concurrent_last" metrics chart
     * @param MEAN_CONCURRENT_METRICS_DATASET_INDEX index of data array for "concurrent_mean" metrics chart
     */

    private readonly Y_AXIS_CHART_TITLE: string = "Concurrency value";
    private readonly X_AXIS_CHART_TITLE: string = MongooseChartOptions.ELAPSED_TIME_AXES_DEFAULT_TAG;

    private readonly MEAN_CONCURRENT_METRICS_DATASET_INDEX = 0;
    private readonly LAST_CONCURRENT_METRICS_DATASET_INDEX = 1;

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

        let concurrentMeanDatasetInitialValue = new MongooseChartDataset([], "Concurrent, mean");
        let concurrencyLastDatasetInitialValue = new MongooseChartDataset([], 'Concurrency, last');

        var concurrencyChartDataset: MongooseChartDataset[] = [];
        concurrencyChartDataset.push(concurrentMeanDatasetInitialValue);
        concurrencyChartDataset.push(concurrencyLastDatasetInitialValue);

        this.chartData = concurrencyChartDataset;

        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[], numericMetricValueType: NumericMetricValueType) {
        let chartIndex: number = undefined;
        switch (numericMetricValueType) {
            case (NumericMetricValueType.LAST): {
                chartIndex = this.LAST_CONCURRENT_METRICS_DATASET_INDEX;
                break;
            }
            case (NumericMetricValueType.MEAN): {
                chartIndex = this.MEAN_CONCURRENT_METRICS_DATASET_INDEX;
                break;
            }
            default: {
                throw new Error(`Unable to find specified metric type ${numericMetricValueType} for Concurrency chart.`);
            }
        }
        this.chartData[chartIndex].data = metrics;
        let labels: string[] = [];
        for (var chartPoint of metrics) {
            let timestamp = chartPoint.getX() as unknown;
            labels.push(timestamp as string);
        }
        this.chartLabels = labels;
    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

    private configureChartOptions() {
        this.chartData[this.LAST_CONCURRENT_METRICS_DATASET_INDEX].setChartColor(MongooseChartOptions.LAST_VALUE_DEFAULT_COLOR_RGB);

        let chartTitle: string = "Mongoose's concurrent operations";
        this.chartOptions.setChartTitle(chartTitle);

        this.configureAxes();
    }

    private configureAxes() {
        this.chartOptions.setAxisLabel(MongooseChartAxesType.Y, this.Y_AXIS_CHART_TITLE, true);
        this.chartOptions.setAxisLabel(MongooseChartAxesType.X, this.X_AXIS_CHART_TITLE, true);
    }
}
