import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.mode";
import { MongooseDurationChart } from "./duration/mongoose-duration-chart.model";
import { MongooseChartOptions } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "./mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseLatencyChart } from "./latency/mongoose-latency-chart.model";
import { MongooseThroughputChart } from "./throughput/mongoose-throughput-chart.model";

export class MongooseChartsRepository { 
    private mongooseChartDao: MongooseChartDao;

    private durationChart: MongooseDurationChart; 
    private latencyChart: MongooseLatencyChart; 
    private thoughputChart: MongooseThroughputChart;

    constructor(mongooseChartDao: MongooseChartDao) { 
        this.mongooseChartDao = mongooseChartDao; 
        this.setUpCharts();

    }

    // MARK: - Public 
    public getDurationChart(): MongooseDurationChart { 
        return this.durationChart; 
    }

    public getLatencyChart(): MongooseLatencyChart { 
        return this.latencyChart; 
    }

    public getThoughputChart(): MongooseThroughputChart { 
        return this.thoughputChart;
    }
    
    // MARK: - Private 

    private setUpCharts() { 
        this.durationChart = this.createMongooseDurationChart(); 
        this.latencyChart = this.createMongooseLatencyChart(); 
        this.thoughputChart = this.createMongooseThroughtputChart(); 
    
    }

    private createMongooseDurationChart(): MongooseDurationChart { 
        let durationChartOptions = new MongooseChartOptions(); 
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
  
        return new MongooseDurationChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, this.mongooseChartDao);
    }

    private createMongooseLatencyChart(): MongooseLatencyChart { 
        
        let durationChartOptions = new MongooseChartOptions();         
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
        return new MongooseLatencyChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, this.mongooseChartDao);
    }

    private createMongooseThroughtputChart(): MongooseThroughputChart { 
        let durationChartOptions = new MongooseChartOptions();         
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
        return new MongooseThroughputChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, this.mongooseChartDao);
    }
}