export class HttpUtils {

    // NOTE: Checks if string matches an IP by pattern.
    public static isIpAddressValid(ipAddress: string): boolean {
        let ipValidationRegex: RegExp = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
        return ipValidationRegex.test(ipAddress);
    }

    public static shouldPerformMongooseRunRequest(mongooseAddress: string): boolean {
        // NOTE: Temporarily checking only IP address.
        let isIpValid: boolean = HttpUtils.isIpAddressValid(mongooseAddress);
        let isIpPointsToLocalhost: boolean = mongooseAddress.includes("localhost");
        return ((isIpValid) || (isIpPointsToLocalhost));
    }
å
}