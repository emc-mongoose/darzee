const MONGOOSE_CONSOLE_DEFAULT_PORT = 8080;
var express = require('express');
var app = express();

var path = __dirname + '';
var port = process.env.CONSOLE_PORT || MONGOOSE_CONSOLE_DEFAULT_PORT;

app.use(express.static(path));
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});

app.post('/savePrometheusConfiguration', function (req, res) {
    var file_name = "prometheus.yml"
    var file_content = req.body;

    var stream = fs.createWriteStream(file_name);
    stream.once('open', function () {
        stream.write(file_content);
        stream.end();
    });
});

app.listen(port);

