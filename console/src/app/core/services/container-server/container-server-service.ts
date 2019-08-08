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

/**
 * Describes service used to interact with Darzee's proxy server.
 * Server documentation: Documentation: https://github.com/emc-mongoose/darzee/blob/master/console/server/README.md
 */
export class ContainerServerService {

    private readonly FILE_SAVE_ENDPOINT = "savefile";
    private readonly RELOAD_PROMETHEUS_ENDPOINT = "reloadprometheus";


    private readonly REQUEST_BODY_FILENAME_PARAM = "fileName";
    private readonly REQUEST_BODY_FILE_CONTENT_PARAM = "fileContent";

    constructor(private http: HttpClient) { }

    public saveFile(fileName: string, fileContent: string): Observable<Object> {
        let requestBody = new FormData();
        requestBody.append(this.REQUEST_BODY_FILENAME_PARAM, fileName);
        requestBody.append(this.REQUEST_BODY_FILE_CONTENT_PARAM, fileContent);
        const containerServicerAddress: string = this.getContainerServicerAddressFromAddressLine();
        let targetUrl = `${containerServicerAddress}/${this.FILE_SAVE_ENDPOINT}`;
        return this.http.post(targetUrl, requestBody, { headers: this.getHttpHeadersForFileSave() });
    }

    /**
     * Reload Prometheus via NodeJS server.
     * @returns Prometheus' reloading status code.
     * @param ipAddress IPv4 address of Prometheus.
     * @param port Prometheus' exposing port.
     */
    public requestPrometheusReload(ipAddress: string, port: string): Observable<any> {
        console.log(`Prometheus will be reloaded on resource ${ipAddress}:${port}`);
        const containerServicerAddress: string = this.getContainerServicerAddressFromAddressLine();

        const prometheusAddressData: Object = {
            // NOTE: JSON's object fields naming is mandatory and should not be changed. 
            // ... if any changes are required, always refer to server's documentation located in class's discription.
            ipAddress: `${ipAddress}`,
            port: `${port}`
        };

        const targetUrl = `${containerServicerAddress}/${this.RELOAD_PROMETHEUS_ENDPOINT}`;
        return this.http.post(targetUrl, prometheusAddressData, Constants.Http.EMPTY_POST_REQUEST_HEADERS);
    }

    /**
     * Fetches current deploying address from browser's address bar.
     * It was done in order to perform HTTP requests to NodeJS proxy server.
     * @deprecated if NodeJS isn't using anymore.
     * @returns current deploying address with HTTP prefix.
     */
    public getContainerServicerAddressFromAddressLine(): string {
        let rawLocation = (document.location as unknown);
        var currentUrl: string = String(rawLocation);
        const emptyValue: string = "";
        // NOTE: Removing HTTP prefix in order to make the parsing easier. Will ...
        // ... be appended back afterwards. 
        currentUrl = currentUrl.replace(Constants.Http.HTTP_PREFIX, emptyValue);
        var rawCurrentAddress: string = "";
        const addressFromRoutingDelimiter: string = "/";
        const shouldPruneAddress: boolean = currentUrl.includes(addressFromRoutingDelimiter);
        if (shouldPruneAddress) {
            rawCurrentAddress = currentUrl.split(addressFromRoutingDelimiter)[0];
        } else {
            rawCurrentAddress = currentUrl;
        }
        return `${Constants.Http.HTTP_PREFIX}${rawCurrentAddress}`;
    }

    private getHttpHeadersForFileSave(): HttpHeaders {
        let httpHeadersForMongooseRun = new HttpHeaders();
        httpHeadersForMongooseRun.append('Content-Type', 'multipart/form-data');
        httpHeadersForMongooseRun.append('Accept', '*/*');
        return httpHeadersForMongooseRun;
    }

}
