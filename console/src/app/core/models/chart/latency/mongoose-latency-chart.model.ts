import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";
import { LatencyType } from "./latency-type";

export class MongooseLatencyChart implements MongooseChart {

    private readonly PERIOD_OF_LATENCY_UPDATE_SECONDS = 2; 

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
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;

        let maxLatencyDataset = new MongooseChartDataset([], 'Larency max');
        let minLatencyDataset = new MongooseChartDataset([], 'Larency min');

        this.chartData = [maxLatencyDataset, minLatencyDataset];
    }

    updateChart(recordLoadStepId: string) {
        let perdiodOfLatencyUpdate = this.PERIOD_OF_LATENCY_UPDATE_SECONDS;
        this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((maxLatencyResult: any) => {
            this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((minLatencyResult: any) => {
                this.processLatencyData(maxLatencyResult, LatencyType.MAX);
                this.processLatencyData(minLatencyResult, LatencyType.MIN);
            })
        })
    }

    shouldDrawChart(): boolean {
        throw new Error("Method not implemented.");
    }

    private isDataForChartValid(data: any): boolean {
        return ((data != undefined) && (data.length > 0));
    }

    private processLatencyData(data: any, latencyType: LatencyType) {
        switch (latencyType) {
            case LatencyType.MAX: {
                let newValue = this.getActualValueFromData(data, latencyType);
                this.chartData[0].data.push(newValue);
                break;
            }
            case LatencyType.MIN: {
                let newValue = this.getActualValueFromData(data, latencyType);
                this.chartData[1].data.push(newValue);
                break;
            }
        }
    }

    private getActualValueFromData(data: any, latencyType: LatencyType): any {
        if (this.isDataForChartValid(data)) {
            let actualValue = data[0]["value"][1];
            return actualValue;
        }

        switch (latencyType) {
            case LatencyType.MAX: {
                return this.getPreviousValueFromDataset(this.chartData[0]);
            }
            case LatencyType.MIN: {
                return this.getPreviousValueFromDataset(this.chartData[1]);
            }
        }
    }


    private getPreviousValueFromDataset(dataset: MongooseChartDataset) {
        let previosValueIndex = dataset.data.length - 1;
        let previosValue = dataset.data[previosValueIndex];
        return previosValue;
    }

}