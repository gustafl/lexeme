'use strict';

var util = require('util');
var mysql = require('mysql');
var xml = require('object-to-xml');

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

var FormatEnum = {
    JSON: 1,
    XML: 2
};

function getFormat(req) {
    switch (req.query.format) {
        case 'xml':
            return FormatEnum.XML;
        case 'json':
            return FormatEnum.JSON;
        default:
            return FormatEnum.XML;
    }
}

module.exports = function (app) {

    // Example: /api/lexical_category
    app.get('/api/lexical_category', function (req, res) {
        var query = "SELECT * FROM lexical_category";
        handleRequest(req, res, query, getFormat(req), false);
    });

    // Example: /api/lexical_category/1
    app.get('/api/lexical_category/:id', function (req, res) {
        var query = "SELECT * FROM lexical_category WHERE id = " + req.params.id;
        handleRequest(req, res, query, getFormat(req), true);
    });

    // Example: /api/language
    app.get('/api/language', function (req, res) {
        var query = "SELECT * FROM language";
        handleRequest(req, res, query, getFormat(req), false);
    });

    // Example: /api/language/1
    app.get('/api/language/:id', function (req, res) {
        var query = "SELECT * FROM language WHERE id = " + req.params.id;
        handleRequest(req, res, query, getFormat(req), true);
    });

    // Example: /api/grammatical_category
    // Example: /api/grammatical_category?lexical_category=1
    // Example: /api/grammatical_category?language=fr
    // Example: /api/grammatical_category?lexical_category=1&language=fr
    app.get('/api/grammatical_category', function (req, res) {
        var query;
        if (req.query.language === undefined) {
            if (req.query.lexical_category === undefined) {
                query = "SELECT grammatical_category.id, grammatical_category.name FROM grammatical_category";
            } else {
                query = "SELECT grammatical_category.id, grammatical_category.name FROM grammatical_category " +
                        "INNER JOIN lexical_category ON grammatical_category.lexical_category = lexical_category.id " +
                        "WHERE lexical_category.id = '" + req.query.lexical_category + "'";
            }
        } else {
            if (req.query.lexical_category === undefined) {
                query = "SELECT grammatical_category.id, grammatical_category.name FROM grammatical_category " +
                        "INNER JOIN language_grammatical_category ON grammatical_category.id = language_grammatical_category.grammatical_category " +
                        "INNER JOIN language ON language.id = language_grammatical_category.language " +
                        "WHERE language.code = '" + req.query.language + "'";
            } else {
                query = "SELECT grammatical_category.id, grammatical_category.name FROM grammatical_category " +
                        "INNER JOIN language_grammatical_category ON grammatical_category.id = language_grammatical_category.grammatical_category " +
                        "INNER JOIN language ON language.id = language_grammatical_category.language " +
                        "INNER JOIN lexical_category ON grammatical_category.lexical_category = lexical_category.id " +
                        "WHERE language.code = '" + req.query.language + "' AND lexical_category.id = '" + req.query.lexical_category + "'";
            }
        }
        handleRequest(req, res, query, getFormat(req), false);
    });

    // Example: /api/grammatical_category/1
    app.get('/api/grammatical_category/:id', function (req, res) {
        var query = 'SELECT * FROM grammatical_category WHERE id = ' + req.params.id;
        handleRequest(req, res, query, getFormat(req), true);
    });

    // Example: /api/grammeme
    // Example: /api/grammeme?grammatical_category=1
    // Example: /api/grammeme?language=fr
    // Example: /api/grammeme?grammatical_category=1&language=fr
    app.get('/api/grammeme', function (req, res) {
        var query;
        if (req.query.language === undefined) {
            if (req.query.grammatical_category === undefined) {
                query = "SELECT grammeme.id, grammeme.name, grammeme.grammatical_category FROM grammeme";
            } else {
                query = "SELECT grammeme.id, grammeme.name, grammeme.grammatical_category FROM grammeme " +
                        "INNER JOIN grammatical_category ON grammeme.grammatical_category = grammatical_category.id " +
                        "WHERE grammatical_category.id = '" + req.query.grammatical_category + "'";
            }
        } else {
            if (req.query.grammatical_category === undefined) {
                query = "SELECT grammeme.id, grammeme.name, grammeme.grammatical_category FROM grammeme " +
                        "INNER JOIN language_grammeme ON grammeme.id = language_grammeme.grammeme " +
                        "INNER JOIN language ON language.id = language_grammeme.language " +
                        "WHERE language.code = '" + req.query.language + "'";
            } else {
                query = "SELECT grammeme.id, grammeme.name, grammeme.grammatical_category FROM grammeme " +
                        "INNER JOIN language_grammeme ON grammeme.id = language_grammeme.grammeme " +
                        "INNER JOIN language ON language.id = language_grammeme.language " +
                        "INNER JOIN grammatical_category ON grammeme.grammatical_category = grammatical_category.id " +
                        "WHERE language.code = '" + req.query.language + "' AND grammatical_category.id = '" + req.query.grammatical_category + "'";
            }
        }
        handleRequest(req, res, query, getFormat(req), false);
    });

    // Example: /api/grammeme/1
    app.get('/api/grammeme/:id', function (req, res) {
        var query = 'SELECT * FROM grammeme WHERE id = ' + req.params.id;
        handleRequest(req, res, query, getFormat(req), true);
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

function handleRequest(req, res, query, format, stripArray) {
    log(util.format('%s %s', req.method, req.url));
    queryDatabase(query, function (err, data) {
        if (err) {
            throw err;
        }
        if (format === FormatEnum.JSON) {
            if (stripArray) {
                console.log(util.inspect(data[0]) + '\n');
                res.AddHeader('Access-Control-Allow-Origin', '*');
                res.json(data[0]);
            } else {
                console.log(util.inspect(data) + '\n');
                res.json(data);
            }
        }
        if (format === FormatEnum.XML) {
            var object;
            if (stripArray) {
                object = {
                    '?xml version="1.0" encoding="utf-8"?': null,
                    item: data[0]
                };
            } else {
                object = {
                    '?xml version="1.0" encoding="utf-8"?': null,
                    list: {
                        item: data
                    }
                };
            }
            console.log(xml(object));
            res.set('Content-Type', 'text/xml');
            res.send(xml(object));
        }
    });
}
