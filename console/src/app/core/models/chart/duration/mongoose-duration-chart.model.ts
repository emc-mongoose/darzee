import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";
import { MongooseTestChartDataset } from "../mongoose-chart-interface/mongoose-test-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MetricValueType } from "../mongoose-chart-interface/metric-value-type";

/**
 * Latency chart for BasicChart component.
 */
export class MongooseDurationChart implements MongooseChart {

    private readonly MEAN_DURATION_DATASET_INDEX = 0;
    private readonly MIN_DURATION_DATASET_INDEX = 1;
    private readonly MAX_DURATION_DATASET_INDEX = 2;

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

        let durationChartDatasetInitialValue = new MongooseTestChartDataset([], 'Mean duration');
        let minDurationChartDatasetInitialValue = new MongooseTestChartDataset([], "Min duration");
        let maxDurationChartDatasetInitialValue = new MongooseTestChartDataset([], "Max duration");

        var durationChartDataset: MongooseTestChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        durationChartDataset.push(minDurationChartDatasetInitialValue);
        durationChartDataset.push(maxDurationChartDatasetInitialValue);

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
                throw new Error(`Unable to find specified metric type ${metricType} for duration chart.`);

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
        const redColorRgb: string = "rgb(255, 0, 0)";
        this.chartData[this.MAX_DURATION_DATASET_INDEX].setChartColor(redColorRgb);

        const yellowColorRgb: string = "rgba(247, 202, 24, 1)";
        this.chartData[this.MEAN_DURATION_DATASET_INDEX].setChartColor(yellowColorRgb);

        const greenColorRgb: string = "rgb(46, 204, 113)";
        this.chartData[this.MIN_DURATION_DATASET_INDEX].setChartColor(greenColorRgb);

        let chartTitle: string = "Mongoose's operations duration, seconds";
        this.chartOptions.setChartTitle(chartTitle);
    }
}
