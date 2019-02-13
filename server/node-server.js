var express = require('express');
var app = express();

var path = __dirname + '';
var port = 8080;

app.use(express.static(path));
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});
app.listen(port);
