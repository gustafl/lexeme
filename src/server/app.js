'use strict';

var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var api = require('./api.js')(app);

var server = app.listen(3000, function () {
    console.log('Listening on port 3000...');
});
