export class HttpUtils {

    public static readonly PORT_NUMBER_UPPER_BOUND: number = 65535;
    public static readonly LOCALHOST_KEYWORD: string = "localhost";

    // NOTE: Checks if string matches an IP by pattern.
    public static isIpAddressValid(ipAddress: string): boolean {
        const localhostKeyword: string = HttpUtils.LOCALHOST_KEYWORD;
        const hasLocalhostKeyword: boolean = ipAddress.includes(localhostKeyword);
        if (!hasLocalhostKeyword) {
            let ipValidationRegex: RegExp = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
            return ipValidationRegex.test(ipAddress);
        }
        const emptyString = "";
        const portNumberAndKeywordDelimiter = ":";
        const remaningAddressWithoutKeywords = ipAddress.replace(localhostKeyword + portNumberAndKeywordDelimiter, emptyString);
        
        const maximumAmountOfDigitsInPort = 5; 
        if (remaningAddressWithoutKeywords.length < maximumAmountOfDigitsInPort) { 
            return false; 
        }

        const portNumber = Number(remaningAddressWithoutKeywords);
        
        return (isNaN(portNumber) && (portNumber <= HttpUtils.PORT_NUMBER_UPPER_BOUND));

    }

    public static shouldPerformMongooseRunRequest(mongooseAddress: string): boolean {
        // NOTE: Temporarily checking only IP address.
        let isIpValid: boolean = HttpUtils.isIpAddressValid(mongooseAddress);
        let isIpPointsToLocalhost: boolean = mongooseAddress.includes("localhost");
        return ((isIpValid) || (isIpPointsToLocalhost));
    }
    å
}