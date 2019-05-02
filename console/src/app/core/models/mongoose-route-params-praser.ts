import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
import { RouteParams } from "src/app/modules/app-module/Routing/params.routes";
import { MonitoringApiService } from "../services/monitoring-api/monitoring-api.service";
import { MongooseRunRecord } from "./run-record.model";
import { map } from "rxjs/operators";

export class MongooseRouteParamsParser { 


    constructor(private monitoringApiService: MonitoringApiService) {  }

    public getMongooseRunRecordByLoadStepId(params: Params): Observable<MongooseRunRecord> { 
        console.log(`Params parser: ${params[RouteParams.ID]}`)
        let targetRecordLoadStepId = params[RouteParams.ID];
        if (targetRecordLoadStepId == undefined) { 
            throw new Error(`Unable to get load step ID from parameters: ${JSON.stringify(params)}`);
        }
        return this.monitoringApiService.getMongooseRunRecordByLoadStepId(targetRecordLoadStepId);
    }
}