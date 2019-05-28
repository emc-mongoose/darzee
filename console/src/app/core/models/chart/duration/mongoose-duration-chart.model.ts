import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions, MongooseChartAxesType } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";

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
    chartData: MongooseChartDataset[];
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

        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');
        let minDurationChartDatasetInitialValue = new MongooseChartDataset([], "Min duration");
        let maxDurationChartDatasetInitialValue = new MongooseChartDataset([], "Max duration");

        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        durationChartDataset.push(minDurationChartDatasetInitialValue);
        durationChartDataset.push(maxDurationChartDatasetInitialValue);

        this.chartData = durationChartDataset;

        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {

        var meanDurationMetrics: any[] = [];
        var minDurationMetrics: any[] = [];
        var maxDurationMetrics: any[] = [];

        var updatedLabels: any[] = [];

        let metricName = InternalMetricNames.MEAN_DURATION;
        metrics.forEach(durationMetric => {
            metricName = durationMetric.getName();
            let durationMetricValue = durationMetric.getValue();
            switch (metricName) {
                case (InternalMetricNames.MEAN_DURATION): {
                    meanDurationMetrics.push(durationMetricValue);
                    break;
                }
                case (InternalMetricNames.MIN_DURATION): {
                    minDurationMetrics.push(durationMetricValue);
                    break;
                }
                case (InternalMetricNames.MAX_DURATION): {
                    maxDurationMetrics.push(durationMetricValue);
                    break;
                }
            }
            updatedLabels.push(formatDate(Math.round(durationMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        });
        this.chartLabels = updatedLabels;

        switch (metricName) {
            case (InternalMetricNames.MEAN_DURATION): {
                this.chartData[this.MEAN_DURATION_DATASET_INDEX].setChartData(meanDurationMetrics);
                break;
            }
            case (InternalMetricNames.MIN_DURATION): {
                this.chartData[this.MIN_DURATION_DATASET_INDEX].setChartData(minDurationMetrics);
                break;
            }
            case (InternalMetricNames.MAX_DURATION): {
                this.chartData[this.MAX_DURATION_DATASET_INDEX].setChartData(maxDurationMetrics);
                break;
            }
        }

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

        let chartTitle: string = "Mongoose's operations duration";
        this.chartOptions.setChartTitle(chartTitle);
    }
}
