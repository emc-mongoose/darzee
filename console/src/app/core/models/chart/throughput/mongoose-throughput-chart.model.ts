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


        console.log(`Throughtput array: ${JSON.stringify(metrics)}`)
        let successfulOperationsMetricName = InternalMetricNames.SUCCESSFUL_OPERATIONS;
        let failedOperationsMetricName = InternalMetricNames.FAILED_OPERATIONS;

        var throughtputChartTimestamps: string[] = [];
        var failedOperationsMetrics: string[] = []; 
        var successfulOperationsMetrics: string[] = [];

        metrics.forEach((metric: MongooseMetric) => { 
            switch(metric.getName()) { 
                case successfulOperationsMetricName: { 
                    successfulOperationsMetrics.push(metric.getValue());
                    throughtputChartTimestamps.push(formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
                    break;
                }
                case failedOperationsMetricName: { 
                    failedOperationsMetrics.push(metric.getValue());
                    break;
                }
            }
        })
        this.chartLabels = throughtputChartTimestamps; 
        this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].setChartData(successfulOperationsMetrics);
        this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].setChartData(failedOperationsMetrics);
        // if (this.shouldShift()) {
        //     this.chartData[this.SUCCESSFUL_OPERATIONS_DATASET_INDEX].data.shift();
        //     this.chartData[this.FAILED_OPERATIONS_DATASET_INDEX].data.shift();
        //     this.chartLabels.shift();
        // }

    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldShift(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
