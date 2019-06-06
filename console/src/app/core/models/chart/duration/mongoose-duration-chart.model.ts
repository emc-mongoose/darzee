import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MetricValueType } from "../mongoose-chart-interface/metric-value-type";

/**
 * Latency chart for BasicChart component.
 */
export class MongooseDurationChart implements MongooseChart {

    private readonly Y_AXIS_CHART_TITLE: string = "Seconds";
    private readonly X_AXIS_CHART_TITLE: string = MongooseChartOptions.ELAPSED_TIME_AXES_DEFAULT_TAG;

    private readonly MIN_DURATION_DATASET_INDEX = 0;
    private readonly MAX_DURATION_DATASET_INDEX = 1;
    private readonly MEAN_DURATION_DATASET_INDEX = 2;


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

        let minDurationChartDatasetInitialValue = new MongooseChartDataset([], "Min duration");
        let maxDurationChartDatasetInitialValue = new MongooseChartDataset([], "Max duration");
        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');


        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(minDurationChartDatasetInitialValue);
        durationChartDataset.push(maxDurationChartDatasetInitialValue);
        durationChartDataset.push(durationChartDatasetInitialValue);

        this.chartData = durationChartDataset;

        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[], metricType: MetricValueType) {

        let chartLineIndex: number = undefined;
        switch (metricType) {
            case (MetricValueType.MEAN): {
                chartLineIndex = this.MEAN_DURATION_DATASET_INDEX;
                break;
            }
            case (MetricValueType.MAX): {
                chartLineIndex = this.MAX_DURATION_DATASET_INDEX;
                break;
            }
            case (MetricValueType.MIN): {
                chartLineIndex = this.MIN_DURATION_DATASET_INDEX;
                break;
            }
            default: {
                throw new Error(`Unable to find specified metric type ${metricType} for Duration chart.`);
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

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

    private configureChartOptions() {

        this.chartData[this.MAX_DURATION_DATASET_INDEX].setChartColor(MongooseChartOptions.MAX_VALUE_DEFAULT_COLOR_RGB);
        this.chartData[this.MEAN_DURATION_DATASET_INDEX].setChartColor(MongooseChartOptions.MEAN_VALUE_DEFAULT_COLOR_RGB);
        this.chartData[this.MIN_DURATION_DATASET_INDEX].setChartColor(MongooseChartOptions.MIN_VALUE_DEFAUT_COLOR_RGB);

        let chartTitle: string = "Mongoose's operations duration, milliseconds per second";
        this.chartOptions.setChartTitle(chartTitle);

        this.configureAxes();
    }

    private configureAxes() {
        this.chartOptions.setAxisLabel(MongooseChartAxesType.Y, this.Y_AXIS_CHART_TITLE, true);
        this.chartOptions.setAxisLabel(MongooseChartAxesType.X, this.X_AXIS_CHART_TITLE, true);
    }
}
