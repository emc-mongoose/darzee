import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "src/app/common/constants";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

// NOTE: Prometheus configuration is being send via the Node.JS server ...
//  which is running within the UI's container. The service is supposed to ...
// ... work with this server. 

export class ContainerServerService {

    private readonly FILE_SAVE_ENDPOINT = "savefile";
    private readonly RELOAD_PROMETHEUS_ENDPOINT = "reloadprometheus";

    private readonly CONTAINER_SERVER_ADDRESS = `${Constants.Http.HTTP_PREFIX}${environment.nodeJsServerIp}:${environment.nodeJsServerPort}`

    private readonly REQUEST_BODY_FILENAME_PARAM = "fileName";
    private readonly REQUEST_BODY_FILE_CONTENT_PARAM = "fileContent";

    constructor(private http: HttpClient) { }

    public saveFile(fileName: string, fileContent: string): Observable<Object> {
        let requestBody = new FormData();
        requestBody.append(this.REQUEST_BODY_FILENAME_PARAM, fileName);
        requestBody.append(this.REQUEST_BODY_FILE_CONTENT_PARAM, fileContent);
        let targetUrl = `${this.CONTAINER_SERVER_ADDRESS}/${this.FILE_SAVE_ENDPOINT}`;
        return this.http.post(targetUrl, requestBody, { headers: this.getHttpHeadersForFileSave() });
    }

    public requestPrometheusReload(): Observable<any> {
        let targetUrl = `${this.CONTAINER_SERVER_ADDRESS}/${this.RELOAD_PROMETHEUS_ENDPOINT}`;
        return this.http.post(targetUrl, Constants.Http.EMPTY_POST_REQUEST_HEADERS);
    }

    private getHttpHeadersForFileSave(): HttpHeaders {
        let httpHeadersForMongooseRun = new HttpHeaders();
        httpHeadersForMongooseRun.append('Content-Type', 'multipart/form-data');
        httpHeadersForMongooseRun.append('Accept', '*/*');
        return httpHeadersForMongooseRun;
    }
}
