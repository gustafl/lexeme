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

function getUniqueValues(objectArray, property, filter) {
    var array = [];
    if (filter === undefined) {
        for (var i = 0; i < objectArray.length; i++) {
            var value = objectArray[i][property];
            if (value !== undefined && array.indexOf(value) === -1) {
                array.push(value);
            }
        }
    } else {
        for (var i = 0; i < objectArray.length; i++) {
            var filterKey = Object.keys(filter)[0];
            var filterValue = filter[filterKey];
            if (objectArray[i][filterKey] === filterValue) {
                var value = objectArray[i][property];
                if (value !== undefined && array.indexOf(value) === -1) {
                    array.push(value);
                }
            }
        }
    }
    return array;
}

function findObject(objectArray, filters) {
    var numberOfFilters = Object.keys(filters).length;
    if (filters !== undefined) {
        for (var i = 0; i < objectArray.length; i++) {
            for (var j = 0; j < numberOfFilters; j++) {
                var filterKey = Object.keys(filters)[j];
                var filterValue = filters[filterKey];
                if (objectArray[i][filterKey] === filterValue) {
                    if (j === (numberOfFilters - 1)) {
                        return objectArray[i];
                    }
                } else {
                    break;
                }
            }
        }
    }
    return null;
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

                // Check for errors
                if (err) {
                    res.status(500).end();
                    return;
                }

                // Prepare an object array to be returned as JSON
                var objects = [];

                // Loop through unique lexical category IDs in order
                var lexicalCategoryArray = getUniqueValues(data, 'lc_id');
                lexicalCategoryArray.sort(compareNumbers);
                lexicalCategoryArray.forEach(function (lc_id) {

                    // Create new object for lexical category
                    var lexicalCategory = {};
                    lexicalCategory.id = lc_id;

                    // Get first object matching this grammatical ID
                    var lc_object = findObject(data, { lc_id: lc_id });

                    // Set lexical category properties
                    lexicalCategory.name = lc_object.lc_name;
                    lexicalCategory.grammaticalCategories = [];

                    // Loop through unique grammatical category IDs in order
                    var grammaticalCategoryFilter = { 'lc_id': lc_id };
                    var grammaticalCategoryArray = getUniqueValues(data, 'gc_id', grammaticalCategoryFilter);
                    grammaticalCategoryArray.sort(compareNumbers);
                    grammaticalCategoryArray.forEach(function (gc_id) {

                        // Create new object for grammatical category
                        var grammaticalCategory = {};
                        grammaticalCategory.id = gc_id;

                        // Get first object matching this grammatical ID
                        var gc_object = findObject(data, { gc_id: gc_id });

                        // Set grammatical category properties
                        grammaticalCategory.name = gc_object.gc_name;
                        grammaticalCategory.subgroup = gc_object.gc_subgroup;
                        grammaticalCategory.grammemes = [];

                        // Loop through grammemes
                        var grammemeFilter = { 'gc_id': gc_id };
                        var grammemeArray = getUniqueValues(data, 'gr_id', grammemeFilter);
                        grammemeArray.sort(compareNumbers);
                        grammemeArray.forEach(function (gr_id) {

                            // Create new object for grammeme
                            var grammeme = {};
                            grammeme.id = gr_id;

                            // Get first object matching this grammeme ID
                            var gr_object = findObject(data, { gr_id: gr_id });
                            grammeme.name = gr_object.gr_name;

                            // Add grammeme to grammatical category
                            if (grammeme.id !== null && grammeme.name !== null) {
                                grammaticalCategory.grammemes.push(grammeme);
                            }
                        });
                        // Add grammatical category to lexical category
                        lexicalCategory.grammaticalCategories.push(grammaticalCategory);
                    });
                    // Add lexical category to return array
                    objects.push(lexicalCategory);
                });
                // Return object array
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
