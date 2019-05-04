import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";

export class MongooseLatencyChart implements MongooseChart {

    chartOptions: MongooseChartOptions;  
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    isChartDataValid: boolean;
    mongooseChartDao: MongooseChartDao;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, chartData: MongooseChartDataset[], mongooseChartDao: MongooseChartDao) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.chartData = chartData;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
    }

    updateChart(recordLoadStepId: string) {
        let perdiodOfLatencyUpdate = 2;
        this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((successOperationResult: any) => { 
        })
    }
    shouldDrawChart(): boolean {
        throw new Error("Method not implemented.");
    }
 

}