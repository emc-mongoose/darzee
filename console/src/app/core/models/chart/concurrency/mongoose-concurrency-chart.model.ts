import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseTestChartDataset } from "../mongoose-chart-interface/mongoose-test-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
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
    private readonly LAST_CONCURRENT_METRICS_DATASET_INDEX = 0;
    private readonly MEAN_CONCURRENT_METRICS_DATASET_INDEX = 1;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseTestChartDataset[];

    mongooseChartDao: MongooseChartDao;
    isChartDataValid: boolean;
    shouldShiftChart: boolean;


    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart;

        let concurrencyLastDatasetInitialValue = new MongooseTestChartDataset([], 'Concurrency, last');
        let concurrentMeanDatasetInitialValue = new MongooseTestChartDataset([], "Concurrent, mean");

        var concurrencyChartDataset: MongooseTestChartDataset[] = [];
        concurrencyChartDataset.push(concurrencyLastDatasetInitialValue);
        concurrencyChartDataset.push(concurrentMeanDatasetInitialValue);

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
        const mediumBlueColorRgb: string = "rgb(0,0,205)";
        this.chartData[this.LAST_CONCURRENT_METRICS_DATASET_INDEX].setChartColor(mediumBlueColorRgb);

        let chartTitle: string = "Mongoose's concurrent operations";
        this.chartOptions.setChartTitle(chartTitle);
    }
}
