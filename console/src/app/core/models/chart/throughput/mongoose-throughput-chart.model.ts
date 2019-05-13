import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";

export class MongooseThroughputChart implements MongooseChart {


    private readonly SUCCESSFUL_OPERATIONS_DATASET_INDEX = 0;
    private readonly FAILED_OPERATIONS_DATASET_INDEX = 1;

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

        let successfulOperationsDataset = new MongooseChartDataset([], 'Successful operations');
        let failedOperationsDataset = new MongooseChartDataset([], 'Failed operations');

        this.chartData = [successfulOperationsDataset, failedOperationsDataset];
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {

        let successfulOperationsMetricName = InternalMetricNames.SUCCESSFUL_OPERATIONS;
        let successfulOperationsMetric = metrics.find(metric => metric.getName() == successfulOperationsMetricName);

        let failedOperationsMetricName = InternalMetricNames.FAILED_OPERATIONS;
        let failedOperationsMetric = metrics.find(metric => metric.getName() == failedOperationsMetricName);

        if ((successfulOperationsMetric == undefined) || (failedOperationsMetric == undefined)) {
            throw new Error(`An error has occured while parsing bandwidth metrics.`);
        }
        this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].appendDatasetWithNewValue(successfulOperationsMetric.getValue());
        this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].appendDatasetWithNewValue(failedOperationsMetric.getValue());

        this.chartLabels.push(formatDate(Math.round(failedOperationsMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        if (this.shouldShift()) {
            this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].data.shift();
            this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].data.shift();
            this.chartLabels.shift();
        }

    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldShift(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
