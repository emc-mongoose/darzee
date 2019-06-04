import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { NumericMetricValueType } from "../mongoose-chart-interface/numeric-metric-value-type";

/**
 * Bandwidth chart for BasicChart component.
 */
export class MongooseBandwidthChart implements MongooseChart {

    private readonly Y_AXIS_CHART_TITLE: string = "MBs per second";
    private readonly X_AXIS_CHART_TITLE: string = MongooseChartOptions.ELAPSED_TIME_AXES_DEFAULT_TAG;

    private readonly MEAN_BANDWIDTH_DATASET_INDEX = 0;
    private readonly LAST_BANDWIDTH_DATASET_INDEX = 1;

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

        let meanBandwidthDataset = new MongooseChartDataset([], 'MBs per second, mean');
        let lastBandwidthDataset = new MongooseChartDataset([], 'MBs per second, last');
        this.chartData = [meanBandwidthDataset, lastBandwidthDataset];
        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[], numericMetricValueType: NumericMetricValueType) {
        let chartIndex: number = undefined;
        switch (numericMetricValueType) {
            case (NumericMetricValueType.LAST): {
                chartIndex = this.LAST_BANDWIDTH_DATASET_INDEX;
                break;
            }
            case (NumericMetricValueType.MEAN): {
                chartIndex = this.MEAN_BANDWIDTH_DATASET_INDEX;
                break;
            }
            default: {
                throw new Error(`Unable to find specified metric type ${numericMetricValueType} for Bandwidth chart.`);
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

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    private configureChartOptions() {
        this.chartData[this.LAST_BANDWIDTH_DATASET_INDEX].setChartColor(MongooseChartOptions.LAST_VALUE_DEFAULT_COLOR_RGB);

        let chartTitle: string = `Amount of bytes processed by Mongoose, MBs per second`;
        this.chartOptions.setChartTitle(chartTitle);

        this.configureAxes();
    }

    private configureAxes() {
        this.chartOptions.setAxisLabel(MongooseChartAxesType.Y, this.Y_AXIS_CHART_TITLE, true);
        this.chartOptions.setAxisLabel(MongooseChartAxesType.X, this.X_AXIS_CHART_TITLE, true);
    }

}
