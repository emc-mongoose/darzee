import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";
import { MongooseMetrics } from "src/app/core/services/mongoose-api-models/MongooseMetrics";
import { NumbericMetricValueType } from "../mongoose-chart-interface/numeric-metric-value-type";

export class MongooseThroughputChart implements MongooseChart {


    private readonly SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX = 0;
    private readonly SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX = 1;

    private readonly FAILED_OPERATIONS_MEAN_DATASET_INDEX = 2;
    private readonly FAILED_OPERATIONS_LAST_DATASET_INDEX = 3;


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

        let successfulOperationsMeanDataset = new MongooseChartDataset([], 'Successful operations, mean');
        let successfulOperationsLastDataset = new MongooseChartDataset([], 'Successful operations, last');

        let failedOperationsMeanDataset = new MongooseChartDataset([], 'Failed operations, last');
        let failedOperationsLastDataset = new MongooseChartDataset([], 'Failed operations, mean');

        this.chartData = [successfulOperationsMeanDataset, successfulOperationsLastDataset, failedOperationsMeanDataset, failedOperationsLastDataset];

        this.configureChartOptions();
    }

    /**
     * Updated chart that contains successful and failed operations rate.
     * @param recordLoadStepId 
     * @param metrics Metrics array with both successful and failed operations, both mean and last. 
     */
    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {
        var throughtputChartTimestamps: string[] = [];

        var failedOperationsMetricsMean: string[] = []; 
        var failedOperationsMetricsLast: string[] = []; 

        var successfulOperationsMetricsMean: string[] = [];
        var successfulOperationsMetricsLast: string[] = [];

        metrics.forEach((metric: MongooseMetric) => { 
            const metricValue = metric.getValue();
            const metricName = metric.getName();

            switch(metricName) { 
                case InternalMetricNames.SUCCESSFUL_OPERATIONS_MEAN: { 
                    successfulOperationsMetricsMean.push(metricValue);
                    throughtputChartTimestamps.push(formatDate(Math.round(metric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
                    break;
                }
                case InternalMetricNames.SUCCESSFUL_OPERATIONS_LAST: { 
                    successfulOperationsMetricsLast.push(metricValue);
                    break;
                }
                case InternalMetricNames.FAILED_OPERATIONS_MEAN: { 
                    failedOperationsMetricsMean.push(metricValue);
                    break;
                }
                case InternalMetricNames.FAILED_OPERATIONS_LAST: { 
                    failedOperationsMetricsLast.push(metricValue);
                    break;
                }
                default: { 
                    console.error(`Internal metricname hasn't been found for metric ${metricName}`);
                    break;
                }
            }
        })
        this.chartLabels = throughtputChartTimestamps; 

        this.updateChartData(successfulOperationsMetricsMean, InternalMetricNames.SUCCESSFUL_OPERATIONS_MEAN);
        this.updateChartData(successfulOperationsMetricsLast, InternalMetricNames.SUCCESSFUL_OPERATIONS_LAST);

        this.updateChartData(failedOperationsMetricsMean, InternalMetricNames.FAILED_OPERATIONS_MEAN);
        this.updateChartData(failedOperationsMetricsLast, InternalMetricNames.FAILED_OPERATIONS_LAST);
    }

    shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldShift(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return (this.chartLabels.length >= maxAmountOfPointsInGraph);
    }

    /**
     * Updates specific chart with @param metrics values.
     * 
     * @param numericMetricValueType - MEAN or LAST successful / faield operations amount.
     */
    private updateChartData(metricValues: string[], metricName: string) { 
        let relatedChartIndex: number = undefined; 
        switch(metricName) { 
            case InternalMetricNames.SUCCESSFUL_OPERATIONS_MEAN: { 
                relatedChartIndex = this.SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX;
                break;
            }
            case InternalMetricNames.SUCCESSFUL_OPERATIONS_LAST: { 
                relatedChartIndex = this.SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX;
                break;
            }
            case InternalMetricNames.FAILED_OPERATIONS_MEAN: { 
                relatedChartIndex = this.FAILED_OPERATIONS_MEAN_DATASET_INDEX;
                break;
            }
            case InternalMetricNames.FAILED_OPERATIONS_LAST: { 
                relatedChartIndex = this.FAILED_OPERATIONS_LAST_DATASET_INDEX;
                break;
            }
            default: { 
                console.error(`Unable to find chart index for thoughtput metric ${metricName}`);
                break;
            }
        }
        this.chartData[relatedChartIndex].setChartData(metricValues);
    }

    private configureChartOptions() { 
        const lightGreenColorRgb: string = "rgb(21, 171, 16)";
        this.chartData[this.SUCCESSFUL_OPERATIONS_LAST_DATASET_INDEX].setChartColor(lightGreenColorRgb);

        const greenColorRgb: string = "rgb(0, 71, 0)";
        this.chartData[this.SUCCESSFUL_OPERATIONS_MEAN_DATASET_INDEX].setChartColor(greenColorRgb);

        const lightRedColorRgb: string = "rgb(240, 0, 0)";
        this.chartData[this.FAILED_OPERATIONS_LAST_DATASET_INDEX].setChartColor(lightRedColorRgb);

        const darkRedColorRgb: string = "rgb(103, 0, 0)";
        this.chartData[this.FAILED_OPERATIONS_MEAN_DATASET_INDEX].setChartColor(darkRedColorRgb);


      }
    
}
