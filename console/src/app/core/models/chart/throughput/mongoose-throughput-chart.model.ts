import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";
import { MongooseOperationResult } from "../mongoose-chart-interface/mongoose-operation-result-type";
import { NumericMetricValueType } from "../mongoose-chart-interface/numeric-metric-value-type";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";

/**
 * Throughtput chart for BasicChart component.
 */
export class MongooseThroughputChart implements MongooseChart {

    private readonly SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX = 0;
    private readonly SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX = 1;

    private readonly FAILED_OPERATIONS_MEAN_DATASET_INDEX = 2;
    private readonly FAILED_OPERATIONS_LAST_DATASET_INDEX = 3;

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

        let successfulOperationsMeanDataset = new MongooseChartDataset([], 'Successful operations, mean');
        let successfulOperationsLastDataset = new MongooseChartDataset([], 'Successful operations, last');

        let failedOperationsLastDataset = new MongooseChartDataset([], 'Failed operations, mean');

        let failedOperationsMeanDataset = new MongooseChartDataset([], 'Failed operations, last');

        this.chartData = [successfulOperationsMeanDataset, successfulOperationsLastDataset, failedOperationsMeanDataset, failedOperationsLastDataset];

        this.configureChartOptions();
    }

    /**
     * Updated chart that contains successful and failed operations rate.
     * @param recordLoadStepId 
     * @param metrics Metrics array with both successful and failed operations, both mean and last. 
     */
    updateChart(recordLoadStepId: string, metrics: ChartPoint[], numericMetricValueType: NumericMetricValueType, operationResultType: MongooseOperationResult) {
        let relatedChartIndex: number = this.getIndexForResultType(numericMetricValueType, operationResultType);
        this.chartData[relatedChartIndex].data = metrics;

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

    private shouldShift(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    private configureChartOptions() {
        const lightGreenColorRgb: string = "rgb(21, 171, 16)";
        this.chartData[this.SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX].setChartColor(lightGreenColorRgb);

        const greenColorRgb: string = "rgb(0, 71, 0)";
        this.chartData[this.SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX].setChartColor(greenColorRgb);

        const lightRedColorRgb: string = "rgb(240, 0, 0)";
        this.chartData[this.FAILED_OPERATIONS_LAST_DATASET_INDEX].setChartColor(lightRedColorRgb);

        const darkRedColorRgb: string = "rgb(103, 0, 0)";
        this.chartData[this.FAILED_OPERATIONS_MEAN_DATASET_INDEX].setChartColor(darkRedColorRgb);

        let chartTitle: string = `Amount of operations performed by Mongoose, operations per second`;
        this.chartOptions.setChartTitle(chartTitle);
    }

    private getIndexForResultType(numericMetricValueType: NumericMetricValueType, operationResultType: MongooseOperationResult): number { 
        const isSuccessful: boolean = (operationResultType == MongooseOperationResult.SUCCESSFUL);
        switch (numericMetricValueType) { 
            case (NumericMetricValueType.LAST): { 
                return isSuccessful ? this.SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX : this.FAILED_OPERATIONS_LAST_DATASET_INDEX;
                break;
            }
            case (NumericMetricValueType.MEAN): { 
                return isSuccessful ? this.SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX : this.FAILED_OPERATIONS_MEAN_DATASET_INDEX;
            }
            default: { 
                throw new Error(`Unable to find matching Rhgouthput chart dataset for operation "${operationResultType}, ${numericMetricValueType}`);
            }
        }

    }
}
