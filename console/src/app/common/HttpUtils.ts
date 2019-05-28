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
            console.error(`${ipAddress} doesn't contain any key words and will be trated as an IP address to be checked.`)
            let ipValidationRegex: RegExp = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
            return ipValidationRegex.test(ipAddress);
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
