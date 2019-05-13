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
    shouldShiftChart: boolean; 

    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart; 

        let bandwidthDataset = new MongooseChartDataset([], 'Byte per second');
        this.chartData = [bandwidthDataset];
    }


    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        let bandwidthMetricName = InternalMetricNames.BANDWIDTH; 
        var bandwidthChartValues: string[] = [];
        var bandwidthChartTimeLabels: string[] = []
        metrics.forEach((metric: MongooseMetric) => { 
            if (metric.getName() != bandwidthMetricName) { 
                return; 
            }
            bandwidthChartValues.push(metric.getValue());
            bandwidthChartTimeLabels.push(formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        });
        this.chartData[this.BANDWIDTH_DATASET_INDEX].setChartData(bandwidthChartValues);

        this.chartLabels = bandwidthChartTimeLabels;
        // if (this.shouldScaleChart()) {
        //     this.chartData[this.BANDWIDTH_DATASET_INDEX].data.shift();
        //     this.chartLabels.shift();
        // }
    }


    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

}
