'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var api = require('./api.js')(app);

var server = app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
