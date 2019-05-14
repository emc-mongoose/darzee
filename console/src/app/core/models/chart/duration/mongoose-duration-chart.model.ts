import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";
import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "../mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { formatDate } from "@angular/common";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";

export class MongooseDurationChart implements MongooseChart {

    private readonly DURATION_DATASET_INDEX = 0;

    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseChartDataset[];
    mongooseChartDao: MongooseChartDao;
    isChartDataValid: boolean;
    shouldShiftChart: boolean;


    constructor(chartOptions: MongooseChartOptions, chartLabels: string[], chartType: string, chartLegend: boolean, mongooseChartDao: MongooseChartDao, shouldShiftChart: boolean = false) {
        this.chartOptions = chartOptions;
        this.chartLabels = chartLabels;
        this.chartType = chartType;
        this.chartLegend = chartLegend;
        this.mongooseChartDao = mongooseChartDao;
        this.isChartDataValid = true;
        this.shouldShiftChart = shouldShiftChart;

        let durationChartDatasetInitialValue = new MongooseChartDataset([], 'Mean duration');
        var durationChartDataset: MongooseChartDataset[] = [];
        durationChartDataset.push(durationChartDatasetInitialValue);
        this.chartData = durationChartDataset;
    }

    updateChart(recordLoadStepId: string, metrics: MongooseMetric[]) {

        var meanDurationMetrics: any[] = [];
        var updatedLabels: any[] = [];

        metrics.forEach(durationMetric => {
            const metricName = durationMetric.getName(); 
            switch (metricName) { 
                case (InternalMetricNames.DURATION): { 
                    meanDurationMetrics.push(durationMetric.getValue());
                    break;
                }
            }

            updatedLabels.push(formatDate(Math.round(durationMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        });
        this.chartLabels = updatedLabels;
        this.chartData[this.DURATION_DATASET_INDEX].setChartData(meanDurationMetrics);
    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

}
