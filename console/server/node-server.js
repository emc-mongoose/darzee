const DARZEE_DEFAULT_PORT = 8080;
const PROMETHEUS_DEFAULT_PORT = 9090;
const PROMETHEUS_DEFAULT_IP = "localhost";

const PROMETHEUS_DEFAULT_CONFIGURATION_PATH = '/configuration/prometheus.yml';

const CONFIGURATION_DIRECTORY_NAME = "configuration";

const PROMETHEUS_CONFIGURATION_FILENAME = "prometeus";
const PROMETHEUS_CONFIGURATION_EXTENSION = ".yml";

const express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
// NOTE: ShellJS is being used to create full path directories. 
var shell = require('shelljs');
const axios = require('axios') // NOTE: Axios is used to perform HTTP requests 

var app = express();

var path = __dirname + '';

// NOTE: Fetching environment variables' values 
var port = process.env.DARZEE_PORT || DARZEE_DEFAULT_PORT;
var prometheusConfigurationPath = process.env.PROMETHEUS_CONFIGURATION_PATH || PROMETHEUS_DEFAULT_CONFIGURATION_PATH;
var prometheusPort = process.env.PROMETHEUS_PORT || PROMETHEUS_DEFAULT_PORT;
var prometheusIp = process.env.PROMETHEUS_IMAGE_IP || PROMETHEUS_DEFAULT_IP;

app.use(express.static(path));
app.use(bodyParser.json()); // NOTE: Supporting JSON-encoded bodies 
app.use(express.multipart()); // NOTE: We're saving Prometheus configuration via the server
// NOTE: CORS configuration 
app.use(cors())
app.options('*', cors());

// NOTE: Saving file on 'CONFIGURATION_DIRECTORY_NAME' folder. 
app.post('/savefile', function (req, res) {
    let fileName = req.body.fileName;
    var creatingFilePath = `${CONFIGURATION_DIRECTORY_NAME}/${fileName}`;
    console.log(`Processing file with path: ${creatingFilePath}`);

    // NOTE: Save Prometheus' configuration to its specified path.
    if (fileName == (PROMETHEUS_CONFIGURATION_FILENAME + PROMETHEUS_CONFIGURATION_EXTENSION)) {
        creatingFilePath = prometheusConfigurationPath;
    }

    var fileContent = req.body.fileContent;

    let configurationDirectoryPath = `${CONFIGURATION_DIRECTORY_NAME}`;
    // NOTE: Creating directory for Prometheus configuration if not exist. 
    if (!fs.existsSync(configurationDirectoryPath)) {
        // NOTE: Using ShellJS in order to create the full path. 
        shell.mkdir('-p', configurationDirectoryPath);
        shell.cd(configurationDirectoryPath);
    }

    var fileWriteFlag = "";
    if (!fs.existsSync(creatingFilePath)) {
        // NOTE: Creating file if it doesn't exist. 
        fileWriteFlag = { flag: 'wx' };
    }

    fs.writeFile(creatingFilePath, fileContent, fileWriteFlag, function (error) {
        if (error) {
            res.send(error);
            return console.log(error);
        }
        let misleadingMessage = "File has been sccessfully saved.";
        console.log(misleadingMessage);
        response = {
            file: fileName,
            hasSavedSuccessfully: true
        }
        res.send(response);
    });
});

// NOTE: Reloading Prometheus. Method was implimented because ...
// ... preflight request from the browser fails. 
/**
 * @param ipAddress - ipv4 address of Prometheus 
 * @param port - Prometheus' exposing port
 */
app.post('/reloadprometheus', function (req, res) {
    var targetPrometheusAddress = req.query.ipAddress || prometheusIp;
    var targetPrometheusPort = req.query.port || prometheusPort;
    
    axios.post(`http://${targetPrometheusAddress}:${targetPrometheusPort}/-/reload`, {})
        .then((prometheusResponse) => {
            console.log(`statusCode: ${prometheusResponse.statusCode}`)
            console.log(prometheusResponse);
            res.send(prometheusResponse);
        })
        .catch((prometheusError) => {
            console.error(prometheusError);
            res.send(prometheusError);
        })
});

// NOTE: Configurating server to serve index.html since during the production ...
// build Angular converts its html's to only one file.
app.get('/*', (req, res) => {
    res.sendfile('./index.html');
});

app.listen(port);
