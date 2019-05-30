import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { NumericMetricValueType } from "../mongoose-chart-interface/numeric-metric-value-type";

/**
 * Bandwidth chart for BasicChart component.
 */
export class MongooseBandwidthChart implements MongooseChart {

    private readonly MEAN_BANDWIDTH_DATASET_INDEX = 0;
    private readonly LAST_BANDWIDTH_DATASET_INDEX = 1;

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

        let meanBandwidthDataset = new MongooseChartDataset([], 'Byte per second, mean');
        let lastBandwidthDataset = new MongooseChartDataset([], 'Byte per second, last');
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
        const mediumBlueColorRgb: string = "rgb(0,0,205)";
        this.chartData[this.LAST_BANDWIDTH_DATASET_INDEX].setChartColor(mediumBlueColorRgb);

        let chartTitle: string = `Amount of bytes processed by Mongoose, bytes per second`;
        this.chartOptions.setChartTitle(chartTitle);
    }

}
