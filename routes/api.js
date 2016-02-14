'use strict';

var util = require('util');
var mysql = require('mysql');

var remoteConnection = {
    // TODO
};

var localConnection = {
    host: 'localhost',
    user: 'gustaf',
    password: 'yXytm4JuYLmVDUuE',
    database: 'lexeme',
    charset: 'utf8mb4'
};

module.exports = function (app) {
    app.get('/api/lexical_category', function (req, res) {
        var query = 'SELECT * FROM lexical_category';
        handleRequest(req, res, query, false);
    });
    app.get('/api/lexical_category/:id', function (req, res) {
        var query = 'SELECT * FROM lexical_category WHERE id = ' + req.params.id;
        handleRequest(req, res, query, true);
    });
    app.get('/api/language', function (req, res) {
        var query = 'SELECT * FROM language';
        handleRequest(req, res, query, false);
    });
    app.get('/api/language/:id', function (req, res) {
        var query = 'SELECT * FROM language WHERE id = ' + req.params.id;
        handleRequest(req, res, query, true);
    });
    app.get('/api/grammatical_category', function (req, res) {
        var query = 'SELECT * FROM grammatical_category';
        handleRequest(req, res, query, false);
    });
    app.get('/api/grammatical_category/:id', function (req, res) {
        var query = 'SELECT * FROM grammatical_category WHERE id = ' + req.params.id;
        handleRequest(req, res, query, true);
    });
    app.get('/api/grammeme', function (req, res) {
        var query = 'SELECT * FROM grammeme';
        handleRequest(req, res, query, false);
    });
    app.get('/api/grammeme/:id', function (req, res) {
        var query = 'SELECT * FROM grammeme WHERE id = ' + req.params.id;
        handleRequest(req, res, query, true);
    });
};

function log(text) {
    var now = new Date();
    var time = now.toLocaleTimeString('sv-SE');
    console.log('%s: %s', time, text);
}

function queryDatabase(query, callback) {
    var result = [];
    var connection = mysql.createConnection(localConnection);
    connection.connect();
    connection.query(query, function (err, rows) {
        if (err) {
            throw err;
        }
        console.log(query);
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var object = {};
            for (var key in rows[i]) {
                object[key] = row[key];
            }
            result.push(object);
        }
    });
    connection.end(function () {
        callback(null, result);
    });
}

function handleRequest(req, res, query, stripArray) {
    log(util.format('%s %s', req.method, req.url));
    queryDatabase(query, function (err, data) {
        if (err) {
            throw err;
        }
        if (stripArray) {
            console.log('%s\n', util.inspect(data[0]));
            res.json(data[0]);
        } else {
            console.log('%s\n', util.inspect(data));
            res.json(data);
        }
    });
}
