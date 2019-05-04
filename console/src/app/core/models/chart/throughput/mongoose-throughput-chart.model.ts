import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";
import { formatDate } from "@angular/common";

export class MongooseThroughputChart implements MongooseChart {

    private readonly PERIOD_OF_DATA_UPDATE_SECONDS = 2; 

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

    updateChart(recordLoadStepId: string) {
        this.mongooseChartDao.getAmountOfSuccessfulOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, recordLoadStepId).subscribe((sucessfulOperationAmount: string) => { 
            this.mongooseChartDao.getAmountOfFailedOperations(this.PERIOD_OF_DATA_UPDATE_SECONDS, recordLoadStepId).subscribe((failedOperationsAmount: string) => { 
                this.chartData[0].appendDatasetWithNewValue(sucessfulOperationAmount); 
                this.chartData[1].appendDatasetWithNewValue(failedOperationsAmount); 


                this.chartLabels.push(formatDate(Date.now(), 'mediumTime', 'en-US'));
                if (this.shouldScaleChart()) {
                  this.chartData[0].data.shift();
                  this.chartData[1].data.shift();
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