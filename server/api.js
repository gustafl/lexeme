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

function compareNumbers(n1, n2) {
    return n1 - n2;
}

module.exports = function (app) {

    // Example: /api/grammatical_category?language=fr
    app.get('/api/grammatical_category', function (req, res) {
        log(util.format('%s %s', req.method, req.url));
        if (req.query.language !== undefined) {

            // Query database for relevant grammatical categories
            var query = util.format("CALL get_language_configuration('%s');", req.query.language);
            queryDatabase(query, function (err, data) {

                if (err) {
                    res.status(500).end();
                    return;
                }

                // Get a sorted array of unique 'gc_id' values
                var array = getUniqueValues(data, 'gc_id');
                array.sort(compareNumbers);

                // Prepare an object array to be returned as JSON
                var objects = [];

                // Loop through unique grammatical category IDs
                array.forEach(function (element) {
                    // Get array of matching objects for this ID
                    var matching = getMatchingObjects(data, 'gc_id', element);
                    if (matching.length > 0) {
                        var object = {};
                        object.id = element;
                        object.name = matching[0].gc_name;
                        object.subgroup = matching[0].gc_subgroup[0];
                        object.grammemes = [];
                        matching.forEach(function (element2) {
                            var grammeme = {};
                            grammeme.id = element2.gr_id;
                            grammeme.name = element2.gr_name;
                            if (grammeme.id !== null && grammeme.name !== null) {
                                object.grammemes.push(grammeme);
                            }
                        });
                        objects.push(object);
                    }
                });
                res.json(objects);
            });
        } else {
            res.status(400).end();
        }
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
