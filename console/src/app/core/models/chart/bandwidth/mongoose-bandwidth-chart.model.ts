import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { InternalMetricNames } from "../internal-metric-names";

/**
 * Bandwidth chart for BasicChart component.
 */
export class MongooseBandwidthChart implements MongooseChart {

    private readonly MEAN_BANDWIDTH_DATASET_INDEX = 0;
    private readonly LAST_BANDWIDTH_DATASET_INDEX = 1;

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

        let meanBandwidthDataset = new MongooseChartDataset([], 'Byte per second, mean');
        let lastBandwidthDataset = new MongooseChartDataset([], 'Byte per second, last');
        this.chartData = [meanBandwidthDataset, lastBandwidthDataset];
        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        var meanBandwidthChartValues: string[] = [];
        var lastBandwidthChartValues: string[] = [];
        var bandwidthChartTimeLabels: string[] = []
        metrics.forEach((metric: MongooseMetric) => {
            const metricName = metric.getName();
            let metricValue = metric.getValue();

            switch (metricName) {
                case (InternalMetricNames.BANDWIDTH_LAST): {
                    lastBandwidthChartValues.push(metricValue);
                    break;
                }
                case (InternalMetricNames.BANDWIDTH_MEAN): {
                    meanBandwidthChartValues.push(metricValue);
                    bandwidthChartTimeLabels.push(formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US'));

                    break;
                }
                default: {
                    console.error(`Unable to find matching internal name for bandwidth metric ${metricName}`);
                    return;
                }
            }

        });
        this.chartData[this.MEAN_BANDWIDTH_DATASET_INDEX].setChartData(meanBandwidthChartValues);
        this.chartData[this.LAST_BANDWIDTH_DATASET_INDEX].setChartData(lastBandwidthChartValues);

        this.chartLabels = bandwidthChartTimeLabels;
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    private configureChartOptions() {
        const mediumBlueColorRgb: string = "rgb(0,0,205)";
        this.chartData[this.LAST_BANDWIDTH_DATASET_INDEX].setChartColor(mediumBlueColorRgb);

        let chartTitle: string = `Amount of bytes processed by Mongoose, bytes per second`;
        this.chartOptions.setChartTitle(chartTitle);
    }

}
