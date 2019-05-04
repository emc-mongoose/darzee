import { MongooseChartDao } from "./mongoose-chart-interface/mongoose-chart-dao.mode";
import { MongooseDurationChart } from "./duration/mongoose-duration-chart.model";
import { MongooseChartOptions } from "./mongoose-chart-interface/mongoose-chart-options";
import { MongooseChartDataset } from "./mongoose-chart-interface/mongoose-chart-dataset.model";
import { MongooseLatencyChart } from "./latency/mongoose-latency-chart.model";

export class MongooseChartsRepository { 
    private mongooseChartDao: MongooseChartDao;

    private durationChart: MongooseDurationChart; 
    private latencyChart: MongooseLatencyChart; 

    constructor(mongooseChartDao: MongooseChartDao) { 
        this.mongooseChartDao = mongooseChartDao; 
        this.setUpCharts();

    }

    // MARK: - Public 
    public getDurationChart(): MongooseDurationChart { 
        return this.durationChart; 
    }

    public getLarencChart(): MongooseLatencyChart { 
        return this.latencyChart; 
    }

    // MARK: - Private 

    private setUpCharts() { 
        this.durationChart = this.generateMongooseDurationChart(); 
        this.latencyChart = this.generateMongooseLatencyChart(); 
    
    }

    private generateMongooseDurationChart(): MongooseDurationChart { 
        let durationChartOptions = new MongooseChartOptions(); 
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
  
        return new MongooseDurationChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, this.mongooseChartDao);
    }

    private generateMongooseLatencyChart(): MongooseLatencyChart { 
        
        let durationChartOptions = new MongooseChartOptions();         
        let durationChartLabels: string[] = []; 
        let durationChartType = "line";
        let durationChartLegend = true; 
        return new MongooseLatencyChart(durationChartOptions, durationChartLabels, durationChartType, durationChartLegend, this.mongooseChartDao);

    }
}