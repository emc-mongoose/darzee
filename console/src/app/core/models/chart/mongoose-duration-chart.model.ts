import { MongooseChart } from "./mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "./mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.mode";
import { formatDate } from "@angular/common";

export class MongooseDurationChart implements MongooseChart {
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    mongooseChartDao: MongooseChartDao;
    isChartDataValid: boolean;

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
        this.mongooseChartDao.getDuration(recordLoadStepId).subscribe((data: any) => {

            if (!this.isDataForChartValid(data)) {
                // NOTE: Changing behavior of displaying charts. If they're not available, a relative notification ...
                // ... is being displayed. 
                this.isChartDataValid = false;
                return;
            }

            const metricValue = data[0]["value"][1];
            const metricTimestamp = data[0]["value"][0];
            this.chartData[0].data.push(metricValue);
            this.chartLabels.push(formatDate(Math.round(metricTimestamp * 1000), 'mediumTime', 'en-US'));
            if (this.chartData[0].data.length >= 20) {
                this.chartData[0].data.shift();
                this.chartLabels.shift();
            }

            if (this.chartData[0].data.length >= 20) {
                this.chartData[0].data.shift();
                this.chartLabels.shift();
            }
        });
    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private isDataForChartValid(data: any): boolean {
        return ((data != undefined) && (data.length > 0));
    }


}