const MONGOOSE_CONSOLE_DEFAULT_PORT = 8080;
const PROMETHEUS_CONFIGURATION_PATH = '/configuration/prometheus.yml';

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors')

var app = express();

var path = __dirname + '';
var port = process.env.CONSOLE_PORT || MONGOOSE_CONSOLE_DEFAULT_PORT;

app.use(express.static(path));
app.use(bodyParser.json()); // NOTE: Supporting JSON-encoded bodies 
app.use(express.multipart()); // NOTE: We're saving Prometheus configuration via the server
// NOTE: CORS configuration 
app.use(cors())
app.options('*', cors());

// NOTE: Configurating server to serve index.html since during the production ...
// build Angular converts its html's to only one file.
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});

app.post('/savefile', function (req, res) {
    var fileName = req.body.fileName;
    var fileContent = req.body.fileContent;

    // var stream = fs.createWriteStream(fileName);
    // stream.once('open', function () {
    //     stream.write(fileContent);
    //     stream.end();
    // });
    console.log("File name:", fileName); 
    console.log("File content: ", fileContent);

    fs.writeFile(PROMETHEUS_CONFIGURATION_PATH, fileContent, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("Prometheus configuration has been updated.");
    }); 
});

app.listen(port);
