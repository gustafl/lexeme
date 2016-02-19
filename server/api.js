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
            return FormatEnum.JSON;
    }
}

/**
 * Takes an object array and returns an array of unique property values.
 * @param  {array}  objectArray  An object array.
 * @param  {string} property     The name of the property to look for.
 * @return {array}               An array of unique property values.
 */
function getUniqueValues(objectArray, property) {
    var array = [];
    for (var i = 0; i < objectArray.length; i++) {
        var value = objectArray[i][property];
        if (array.indexOf(value) < 0) {
            array.push(value);
        }
    }
    return array;
}

/**
 * Takes an object array and returns an array of objects matching a
 * given property and a property value.
 * @param  {array}  objectArray  An object array.
 * @param  {string} property     The name of the property to look for.
 * @param  {any}    value        The property value that has to match.
 * @return {array}               An array of matching objects.
 */
function getMatchingObjects(objectArray, property, value) {
    var array = [];
    for (var i = 0; i < objectArray.length; i++) {
        if (objectArray[i][property] === value) {
            array.push(objectArray[i]);
        }
    }
    return array;
}

module.exports = function (app) {

    // Example: /api/grammatical_category?lexical_category=1&language=fr
    app.get('/api/grammatical_category', function (req, res) {
        log(util.format('%s %s', req.method, req.url));
        if (req.query.language !== undefined &&
            req.query.lexical_category !== undefined) {

            // Query database for relevant grammatical categories
            var query = util.format("CALL select_grammatical_categories('%s', %s);", req.query.language, req.query.lexical_category);
            queryDatabase(query, function (err, data) {
                if (err) {
                    res.status(500).end();
                    return;
                }

                var objects = [];

                // Loop through unique grammatical category IDs
                var array = getUniqueValues(data, 'grammatical_category_id');
                array.forEach(function (element, index, array) {
                    // Get all objects for this ID
                    var matching = getMatchingObjects(data, 'grammatical_category_id', element);
                    if (matching.length > 0) {
                        var object = {};
                        object.id = element;
                        object.name = matching[0].grammatical_category_name;
                        object.grammemes = [];
                        matching.forEach(function (element2, index2, array2) {
                            var grammeme = {};
                            grammeme.id = element2.grammeme_id;
                            grammeme.name = element2.grammeme_name;
                            if (grammeme.id !== null && grammeme.name !== null) {
                                object.grammemes.push(grammeme);
                            }
                        });
                        objects.push(object);
                    }
                });
                handleResponse(res, objects, getFormat(req));
            });
        } else {
            res.status(400).end();
        }
    });

};

function log(text) {
    var now = new Date();
    var time = now.toLocaleTimeString('sv-SE');
    //console.log('%s: %s', time, text);
}

function queryDatabase(query, callback) {
    var result = [];
    var connection = mysql.createConnection(localConnection);
    connection.connect();
    connection.query(query, function (err, rows) {
        if (err) {
            throw err;
        }
        var actualRows = rows[0];
        for (var i = 0; i < actualRows.length; i++) {
            var row = actualRows[i];
            var object = {};
            for (var key in row) {
                object[key] = row[key];
            }
            result.push(object);
        }
    });
    connection.end(function () {
        callback(null, result);
    });
}

function handleResponse(res, data, format) {
    if (format === FormatEnum.JSON) {
        //console.log(util.inspect(data) + '\n');
        res.json(data);
    }
    if (format === FormatEnum.XML) {
        var object = {
            '?xml version="1.0" encoding="utf-8"?': null,
            list: {
                item: data
            }
        };
        //console.log(xml(object));
        res.set('Content-Type', 'text/xml');
        res.send(xml(object));
    }
}
