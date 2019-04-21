// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // NOTE: Prometheus-related configuration
  prometheusConfigPath: '/assets/configuration-examples/prometheus/prometheus.yml',
  prometheusIp: 'localhost',
  prometheusPort: `9090`,

  // NOTE: NodeJS Server related configuration. It's ...
  // ... being used to server .html files in production and perform POST ...
  // ... requests to Prometheus.
  nodeJsServerIp: 'localhost',
  nodeJsServerPort: `8080`,

  // NOTE: Mongoose-related configuration 
  mongooseIp: 'localhost',
  mongoosePort: `9999`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
