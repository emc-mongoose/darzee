/**
 * Handles 
 */
export class PrometheusError extends Error {

    prometheusResponseStatus: number;

    constructor(message: string, prometheusResponseStatus: number) {
        super(message);
        this.prometheusResponseStatus = prometheusResponseStatus;

        // NOTE: Setting prototype implicitly in order to prevent invalid convertion to ...
        // ... custom error class.
        Object.setPrototypeOf(this, PrometheusError.prototype);
    }

    getReason(): string {
        return this.message;
    }
}
