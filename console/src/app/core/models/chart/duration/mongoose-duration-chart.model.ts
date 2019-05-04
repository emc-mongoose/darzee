import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.mode";
import { formatDate } from "@angular/common";

export class MongooseDurationChart implements MongooseChart {

    private readonly DURATION_DATASET_INDEX = 0; 

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    mongooseChartDao: MongooseChartDao;
    isChartDataValid: boolean;

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;

        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');
        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        this.chartData = durationChartDataset;
    }

    updateChart(recordLoadStepId: string) {
        this.mongooseChartDao.getDuration(recordLoadStepId).subscribe((data: any) => {

            if (!this.isDataForChartValid(data)) {
                // NOTE: Changing behavior of displaying charts. If they're not available, a relative notification ...
                // ... is being displayed. 
                this.isChartDataValid = false;
                return;
            }
            this.isChartDataValid = true;

            // NOTE: Data from Prometheus are coming in 2d-array, e.g.: [[timestamp, "value"]]
            // TODO: Move data retrieving to Prometheus service. 
            const metricValue = data[0]["value"][1];
            const metricTimestamp = data[0]["value"][0];
            this.chartData[0].data.push(metricValue);
            this.chartLabels.push(formatDate(Math.round(metricTimestamp * 1000), 'mediumTime', 'en-US'));
            if (this.shouldScaleChart()) {
                this.chartData[this.DURATION_DATASET_INDEX].data.shift();
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

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }


}