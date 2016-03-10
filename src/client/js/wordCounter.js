'use strict';

/**
 * The WordCounter is used to retrieve, calculate and display word statistics
 * in the footer of a document for testing and benchmarking purposes.
 */
var WordCounter = function (sortOrder) {

    /**
     * All letter characters in the range 00-FF.
     * @type {String}
     */
    const LETTER = 'a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF';

    /**
     * An object array containing word objects. Word objects contain the
     * properties word, instances and percentage.
     * @type {Array}
     */
    var objects = [];

    /**
     * An object containing a set of word statistics.
     * @type {Object}
     */
    var statistics = {
        totalWordCount: 0,
        uniqueWordCount: 0,
        tenMostCommonWordsPercentage: 0,
        hundredMostCommonWordsPercentage: 0
    }

    /**
     * Sorts word objects in ascending order on the 'word' property.
     * @param  {Object} a A word object.
     * @param  {Object} b A word object.
     * @return {Number}   An integer expressing the sort order between the
     *                    input objects.
     */
    var alphabeticalComparator = function (a, b) {
        if (a.word < b.word) return -1;
        if (a.word > b.word) return 1;
        return 0;
    };

    /**
     * Sorts word objects in descending order on the 'instances' property
     * @param  {Object} a A word object.
     * @param  {Object} b A word object.
     * @return {Number}   An integer expressing the sort order between the
     *                    input objects.
     */
    var frequencyComparator = function (a, b) {
        if (a.instances < b.instances) return 1;
        if (a.instances > b.instances) return -1;
        return 0;
    };

    /**
     *
     */

    /**
     * Counts instances of words and populates the statistics object.
     * @param  {String} selector A jQuery selector pointing to the part of the
     *                           document where words will be counted.
     */
    var count = function (selector) {

        // Get all text in selected part of document
        var someText = $(selector).text();

        // Get array of words containing valid letters only
        var separator = new RegExp('[^' + LETTER + ']');
        var words = someText.split(separator);
        words = words.filter(function (value) {
            return (value !== '');
        });

        // Get object array with word frequencies
        statistics.totalWordCount = words.length;
        for (var i = 0; i < words.length; i++) {
            var isDuplicate = false;
            for (var j = 0; j < objects.length; j++) {
                if (objects[j].word === words[i]) {
                    objects[j].instances += 1;
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                var object = {};
                object.word = words[i];
                object.instances = 1;
                object.percentage = 0;
                objects.push(object);
                statistics.uniqueWordCount += 1;
            }
        }

        // Sort the array of word objects
        switch (sortOrder) {
            case 'alphabetical':
                objects = objects.sort(alphabeticalComparator);
            case 'frequency':
                objects = objects.sort(frequencyComparator);
        }

        // Calculate word percentages and most common words
        for (var i = 0; i < objects.length; i++) {
            var percentage = (parseInt(objects[i].instances) / statistics.totalWordCount) * 100;
            percentage = Math.round(percentage * 100) / 100;
            objects[i].percentage = percentage;
            if (i <= 9) {
                statistics.tenMostCommonWordsPercentage += percentage;
            }
            if (i <= 99) {
                statistics.hundredMostCommonWordsPercentage += percentage;
            }
        }
    };

    var getWords = function () {
        return objects;
    }

    /**
     * Appends a new table cell to a given row.
     * @param  {HTMLTableRowElement} $tr The table row to append to.
     * @param  {String} content          The contents on the new table cell.
     */
    var appendTableCell = function ($tr, content) {
        var $td = $('<td />').html(content);
        $tr.append($td);
        return $tr;
    };

    /**
     * Shows the contents of the word object array in a table in the footer.
     */
    var showWords = function () {
        var $footer = $('footer');
        var $table = $('<table />');
        for (var i = 0; i < objects.length; i++) {
            var $tr = $('<tr />');
            appendTableCell($tr, i + 1);
            appendTableCell($tr, objects[i].word);
            appendTableCell($tr, objects[i].instances);
            appendTableCell($tr, objects[i].percentage + '%');
            $table.append($tr);
        }
        $footer.append($table);
    };

    /**
     * Shows the contents of the statistics object in a table in the footer.
     */
    var showStatistics = function() {
        var $footer = $('footer');
        var $table = $('<table />');
        var $tr = $('<tr />');
        appendTableCell($tr, 'Word count');
        appendTableCell($tr, statistics.totalWordCount);
        $table.append($tr);
        $tr = $('<tr />');
        appendTableCell($tr, 'Unique word count');
        appendTableCell($tr, statistics.uniqueWordCount);
        $table.append($tr);
        $tr = $('<tr />');
        appendTableCell($tr, 'Ten most common word percentage');
        statistics.tenMostCommonWordsPercentage = Math.round(statistics.tenMostCommonWordsPercentage * 100) / 100;
        appendTableCell($tr, statistics.tenMostCommonWordsPercentage);
        $table.append($tr);
        $tr = $('<tr />');
        appendTableCell($tr, 'Hundred most common word percentage');
        statistics.hundredMostCommonWordsPercentage = Math.round(statistics.hundredMostCommonWordsPercentage * 100) / 100;
        appendTableCell($tr, statistics.hundredMostCommonWordsPercentage);
        $table.append($tr);
        $footer.append($table);
    };

    return {
        count: count,
        getWords: getWords,
        showWords: showWords,
        showStatistics: showStatistics
    };
};
