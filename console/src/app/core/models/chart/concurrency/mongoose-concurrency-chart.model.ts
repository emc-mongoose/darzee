import { MongooseChartOptions } from "../mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDao } from "../mongoose-chart-interface/mongoose-chart-dao.model";
import { MongooseMetric } from "../mongoose-metric.model";
import { InternalMetricNames } from "../internal-metric-names";
import { formatDate } from "@angular/common";
import { MongooseTestChartDataset } from "../mongoose-chart-interface/mongoose-test-chart-dataset.model";
import { ChartPoint } from "../mongoose-chart-interface/chart-point.model";
import { MongooseChart } from "../mongoose-chart-interface/mongoose-chart.interface";

/**
 * Concurrency chart for BasicChart component.
 */
export class MongooseConcurrencyChart implements MongooseChart { 
    chartOptions: MongooseChartOptions;
    chartLabels: string[];
    chartType: string;
    chartLegend: boolean;
    chartData: MongooseTestChartDataset[];

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

        let concurrencyLastDatasetInitialValue = new MongooseTestChartDataset([], 'Concurrency, last');

        var concurrencyChartDataset: MongooseTestChartDataset[] = [];
        concurrencyChartDataset.push(concurrencyLastDatasetInitialValue);

        this.chartData = concurrencyChartDataset;

        this.configureChartOptions();
    }

    updateChart(recordLoadStepId: string, metrics: ChartPoint[]) {

        this.chartData[0].data = metrics;
        let labels: string[] = [];
        for (var chartPoint of metrics) { 
            let timestamp = chartPoint.getX() as unknown; 
            labels.push(timestamp as string);
        }
        // var concurrencyLastMetrics: any[] = [];

        // var updatedLabels: any[] = [];

        // let metricName = InternalMetricNames.MEAN_DURATION;
        // metrics.forEach(concurrencyMetric => {
        //     metricName = concurrencyMetric.getName();
        //     let durationMetricValue = concurrencyMetric.getValue();
            
        //     updatedLabels.push(formatDate(Math.round(concurrencyMetric.getTimestamp() * 1000), 'mediumTime', 'en-US'));
        // });
        this.chartLabels = labels;


    }

    public shouldDrawChart(): boolean {
        return this.isChartDataValid;
    }

    private shouldScaleChart(): boolean {
        const maxAmountOfPointsInGraph = 20;
        return ((this.chartLabels.length >= maxAmountOfPointsInGraph) && this.shouldShiftChart);
    }

    private configureChartOptions() {

        let lightRedColorRgb: string = "rgb(255, 0, 0)";
        this.chartData[0].setChartColor(lightRedColorRgb);
        let chartTitle: string = "Mongoose's concurrent operations";
        this.chartOptions.setChartTitle(chartTitle);
    }
}