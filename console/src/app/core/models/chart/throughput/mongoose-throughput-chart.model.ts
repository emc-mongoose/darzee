import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";

export class MongooseThroughputChart implements MongooseChart {

    private readonly PERIOD_OF_DATA_UPDATE_SECONDS = 2;

    private readonly SUCCESSFUL_OPERATIONS_DATASET_INDEX = 0; 
    private readonly FAILED_OPERATIONS_DATASET_INDEX = 1;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    isChartDataValid: boolean;
    mongooseChartDao: MongooseChartDao;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;

        let successfulOperationsDataset = new MongooseChartDataset([], 'Successful operations');
        let failedOperationsDataset = new MongooseChartDataset([], 'Failed operations');

        this.chartData = [successfulOperationsDataset, failedOperationsDataset];
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        this.mongooseChartDao.getAmountOfSuccessfulOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, recordLoadStepId).subscribe((sucessfulOperationAmount: MongooseMetric) => {
            this.mongooseChartDao.getAmountOfFailedOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, recordLoadStepId).subscribe((failedOperationsMetric: MongooseMetric) => {
                this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].appendDatasetWithNewValue(sucessfulOperationAmount.getValue());
                this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].appendDatasetWithNewValue(failedOperationsMetric.getValue());

                this.chartLabels.push(formatDate(Date.now(), 'mediumTime', 'en-US'));
                if (this.shouldScaleChart()) {
                    this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].data.shift();
                    this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].data.shift();
                    this.chartLabels.shift();
                }
            })
        })
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }


}