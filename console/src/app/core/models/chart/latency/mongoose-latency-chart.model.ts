import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";


export class MongooseLatencyChart implements MongooseChart {

    private readonly PERIOD_OF_LATENCY_UPDATE_SECONDS = 2;

    private readonly MAX_LATENCY_DATASET_INDEX = 0;
    private readonly MIN_LATENCY_DATASET_INDEX = 1;

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

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        let perdiodOfLatencyUpdate = this.PERIOD_OF_LATENCY_UPDATE_SECONDS;

        let maxLatencyMetricName = InternalMetricNames.LATENCY_MAX;
        let maxLatencyMetric = metrics.find(metric => metric.getName() == maxLatencyMetricName);

        let minLatencyMetricName = InternalMetricNames.LATENCY_MIN;
        let minLatencyMetric = metrics.find(metric => metric.getName() == minLatencyMetricName);

        if ((minLatencyMetric == undefined) || (maxLatencyMetric == undefined)) { 
            throw new Error(`An error has occured while parsing latency metrics.`);
        }

        this.chartData[this.MAX_LATENCY_DATASET_INDEX].appendDatasetWithNewValue(maxLatencyMetric.getValue());
        this.chartData[this.MIN_LATENCY_DATASET_INDEX].appendDatasetWithNewValue(minLatencyMetric.getValue());


        this.chartLabels.push(formatDate(Date.now(), 'mediumTime', 'en-US'));
        if (this.shouldScaleChart()) {
            this.chartData[this.MAX_LATENCY_DATASET_INDEX].data.shift();
            this.chartData[this.MIN_LATENCY_DATASET_INDEX].data.shift();
            this.chartLabels.shift();
        }
        // this.mongooseChartDao.getLatencyMax(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((maxLatencyResult: MongooseMetric) => {
        //     this.mongooseChartDao.getLatencyMin(perdiodOfLatencyUpdate, recordLoadStepId).subscribe((minLatencyResult: MongooseMetric) => {



        // });

    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}