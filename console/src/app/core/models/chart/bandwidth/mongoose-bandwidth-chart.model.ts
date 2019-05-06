import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";

export class MongooseBandwidthChart implements MongooseChart {

    private readonly PERIOD_OF_DATA_UPDATE_SECONDS = 2;

    private readonly BANDWIDTH_DATASET_INDEX = 0;

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

        let bandwidthDataset = new MongooseChartDataset([], 'Byte per second');
        this.chartData = [bandwidthDataset];
    }


    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        let bandwidthMetricName = InternalMetricNames.BANDWIDTH; 
        let bandwidthMetric = metrics.find(metric => metric.getName() == bandwidthMetricName);
        if (bandwidthMetric == undefined) {
            throw new Error(`An error has occured while parsing duration metrics.`);
        }
        this.chartData[this.BANDWIDTH_DATASET_INDEX].appendDatasetWithNewValue(bandwidthMetric.getValue());

        this.chartLabels.push(formatDate(Math.round(bandwidthMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        if (this.shouldScaleChart()) {
            this.chartData[this.BANDWIDTH_DATASET_INDEX].data.shift();
            this.chartLabels.shift();
        }
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
