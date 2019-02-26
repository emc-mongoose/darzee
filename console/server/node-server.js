const MONGOOSE_CONSOLE_DEFAULT_PORT = 8080;
var express = require('express');
var app = express();

var path = __dirname + '';
var port = process.env.CONSOLE_PORT || MONGOOSE_CONSOLE_DEFAULT_PORT;

app.use(express.static(path));
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});
app.listen(port);

