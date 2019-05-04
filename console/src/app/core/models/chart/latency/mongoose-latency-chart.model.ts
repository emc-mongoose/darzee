import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";
import { formatDate } from "@angular/common";

export class MongooseLatencyChart implements MongooseChart {

    private readonly PERIOD_OF_LATENCY_UPDATE_SECONDS = 2; 

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

        let maxLatencyDataset = new MongooseChartDataset([], 'Larency max');
        let minLatencyDataset = new MongooseChartDataset([], 'Larency min');

        this.chartData = [maxLatencyDataset, minLatencyDataset];
    }

    updateChart(recordLoadStepId: string) {
        let perdiodOfLatencyUpdate = this.PERIOD_OF_LATENCY_UPDATE_SECONDS;
        this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((maxLatencyResult: string) => {
            this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((minLatencyResult: string) => {
                
                this.chartData[0] = this.getUpdatedDataset(this.chartData[0], maxLatencyResult);
                this.chartData[1] = this.getUpdatedDataset(this.chartData[1], minLatencyResult);


                this.chartLabels.push(formatDate(Date.now(), 'mediumTime', 'en-US'));
                if (this.shouldScaleChart()) {
                  this.chartData[0].data.shift();
                  this.chartData[1].data.shift();
                  this.chartLabels.shift();
                }
            });
            
        });
       
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private isDataForChartValid(data: any): boolean {
        return ((data != undefined) && (data.length > 0));
    }


    private getUpdatedDataset(dataSet: MongooseChartDataset, newValue: string): MongooseChartDataset { 
        const emptyValue = "";
        if (newValue == emptyValue) { 
            newValue = this.getPreviousValueFromDataset(dataSet);
        }
        dataSet.data.push(newValue);
        return dataSet; 
    }


    private getPreviousValueFromDataset(dataset: MongooseChartDataset) {
        let previosValueIndex = dataset.data.length - 1;
        let previosValue = dataset.data[previosValueIndex];
        return previosValue;
    }

    private shouldScaleChart(): boolean { 
        const maxAmountOfPointsInGraph = 20; 
        return (this.chartLabels.length >= maxAmountOfPointsInGraph); 
    }

}