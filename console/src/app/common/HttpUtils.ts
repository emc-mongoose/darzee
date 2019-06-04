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

    /**
     * Returns true if @param ipAddress matches IP address pattern. 
     * With exception if address caontains keyword (only "localhost" at the moment).
     */
    public static isIpAddressValid(ipAddress: string): boolean {
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
        const ipAddressWithoutPortPattern: RegExp = new RegExp('[0-9]+(?:\.[0-9]+){3}');
        return (ipAddressWithoutPortPattern.test(ipAddress));
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
}
