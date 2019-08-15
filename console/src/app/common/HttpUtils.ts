import { Constants } from "./constants";

/**
 * Utilities for working with HTTP calls. Mainly validation functions.
 */
export class HttpUtils {

    /**
     * @param PORT_NUMBER_UPPER_BOUND maximal available number of port.
     * @param LOCALHOST_KEYWORD contains "localhost" as string.  
     */
    public static readonly PORT_NUMBER_UPPER_BOUND: number = 65535;
    public static readonly LOCALHOST_KEYWORD: string = "localhost";
    public static readonly HTTP_PREFIX: string = "http://";
    public static readonly HTTPS_PREFIX: string = "https://";

    /**
     * Returns true if @param ipAddress matches IP address pattern. 
     * With exception if address caontains keyword (only "localhost" at the moment).
     */
    public static isIpAddressValid(ipAddress: string): boolean {
        // NOTE: Prunning HTTP / HTTPS prefixes in order to test pattern-matching.
        const hasHttpPrefix: boolean = (ipAddress.includes(HttpUtils.HTTP_PREFIX) || ipAddress.includes(HttpUtils.HTTPS_PREFIX));
        if (hasHttpPrefix) {
            const emptyString: string = "";
            ipAddress = ipAddress.replace(HttpUtils.HTTP_PREFIX, emptyString);
            ipAddress = ipAddress.replace(HttpUtils.HTTPS_PREFIX, emptyString);
        }

        const localhostKeyword: string = HttpUtils.LOCALHOST_KEYWORD;
        const hasLocalhostKeyword: boolean = ipAddress.includes(localhostKeyword);

        if (!hasLocalhostKeyword) {
            const ipV4Pattern: RegExp = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$");
            return ipV4Pattern.test(ipAddress);
        }
        const emptyString = "";
        const portNumberAndKeywordDelimiter = ":";
        const remaningAddressWithoutKeywords = ipAddress.replace(localhostKeyword + portNumberAndKeywordDelimiter, emptyString);

        const maximumAmountOfDigitsInPort = 5;
        if (remaningAddressWithoutKeywords.length >= maximumAmountOfDigitsInPort) {
            return false;
        }

        const portNumber = Number(remaningAddressWithoutKeywords);
        return (!isNaN(portNumber) && (portNumber <= HttpUtils.PORT_NUMBER_UPPER_BOUND));
    }

    /**
     * Check if given IP address contains port.
     * @param ipAddress IP address to be checked.
     * @returns true if provided IP address has port.
     */
    public static matchesIpv4AddressWithoutPort(ipAddress: string): boolean {
        // NOTE: Check IP address to match pattern "xxx.xxx.xxx.xxx".
        return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(ipAddress);
    }

    /**
     * @returns if given adress is valid for performing Mongoose run.
     * @param mongooseAddress mongoose run entry node.
     */
    public static shouldPerformMongooseRunRequest(mongooseAddress: string): boolean {
        // NOTE: Temporarily checking only IP address.
        let isIpValid: boolean = HttpUtils.isIpAddressValid(mongooseAddress);
        let isIpPointsToLocalhost: boolean = mongooseAddress.includes("localhost");
        return ((isIpValid) || (isIpPointsToLocalhost));
    }

    public static addPortToIp(ipAddress: string, port: number): string {
        const lastSymbolIndex: number = (ipAddress.length - 1);
        const ipAndPortDelimiter: string = ':';
        if (ipAddress[lastSymbolIndex] == ipAndPortDelimiter) {
            return (ipAddress + port);
        }
        return (ipAddress + ipAndPortDelimiter + port);
    }

    /**
     * Prunes HTTP ("http://") or HTTPS ("https://") prefixes from given address.
     * @param address IPv4 address.
     * @return address without HTTP prefix.
     */
    public static pruneHttpPrefixFromAddress(address: string): string {
        const httpPrefix: string = Constants.Http.HTTP_PREFIX;
        const httpsPrefix: string = Constants.Http.HTTPS_PREFIX;
        const emptyValue: string = "";
        
        // NOTE: Prefix pruning logic 
        if (address.includes(httpPrefix)) {
            // NOTE: Handling HTTP-prefixed addresses
            return address.replace(httpPrefix, emptyValue);
        } else if (address.includes(httpsPrefix)) {
            // NOTE: Handling HTTPS-prefixed addresses
            return address.replace(httpsPrefix, emptyValue);
        }
        return address;
    }
}
