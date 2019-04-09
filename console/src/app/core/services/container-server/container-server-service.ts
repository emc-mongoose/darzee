import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

// NOTE: Prometheus configuration is being send via the Node.JS server ...
//  which is running within the UI's container. The service is supposed to ...
// ... work with this server. 

export class ContainerServerService {

    constructor(private http: HttpClient) {}
}