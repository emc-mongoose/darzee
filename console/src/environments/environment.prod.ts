export const environment = {
  production: true,

  // NOTE: Prometheus-related configuration. It's collection metrics exported by Mongoose. 
  prometheusConfigPath: '${PROMETHEUS_CONFIGURATION_PATH}',
  prometheusIp: '${PROMETHEUS_IMAGE_IP}',
  prometheusPort: '${PROMETHEUS_PORT}',

  // NOTE: NodeJS Server related configuration. It's used to server .html files ...
  // ... (that's why it's address matches Mongoose Console's address) in production and ...
  // ... to perform POST requests to Prometheus.
  nodeJsServerIp: '${NODE_SERVER_IMAGE_IP}',
  nodeJsServerPort: '${CONSOLE_PORT}',

  // NOTE: Mongoose-related configuration 
  mongooseIp: 'localhost',
  mongoosePort: '${MONGOOSE_PORT}'
};
