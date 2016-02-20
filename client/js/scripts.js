'use strict';

function isValidLetter(letter) {
    letter = letter.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (letter !== '') ? true : false;
}

// Change the text content of a jQuery selection smoothly, using fadeOut() and fadeIn()
function changeContent(selector, text, duration) {
    if (duration === undefined) {
        duration = 100;
    }
    $(selector).fadeOut(duration, function () {
        $(selector).val(text);
        $(selector).fadeIn(duration);
    });
}

function changeWord(word, selection) {

    console.info("changeWord('%c%s%c', %O) called.", "font-weight: bold; color: blue;", word, "font-weight: normal; color: black;", selection);

    // Display word in header
    changeContent('#word', word);

    // If this is the first time a word is selected
    if ($('fieldset.header').attr('data-selected') === 'no') {

        // Display the IPA field
        $('fieldset.header').animate(
            { height: '165px' },
            { duration: 250, queue: false, complete: function () {
                $('#ipa').fadeIn(100);
            }}
        );

        // Display lexical categories buttons
        $('#lexical-category').slideDown();

        // Display 'Add translation' button
        $('#translation').slideDown();

        // Prevent this section to run again
        $('fieldset.header').attr('data-selected', 'yes');
    }
}

// Handle clicks in the <article> element
function articleClickHandler() {

    console.info("$('article').click() called.");

    // Get the current position of the caret.
    var selection = window.getSelection();
    // Get the Range object corresponding to the selection.
    var range = selection.getRangeAt(0);
    // If the user clicked a word (instead of drag-selecting).
    if (range.startOffset === range.endOffset) {
        // Get the zero-based index of the letter where the user clicked.
        var index = range.startOffset;
        // Get the full string.
        var data = selection.anchorNode.data;
        // Get the actual letter the user clicked on.
        var letter = data.substring(index, index + 1);
        // If the letter is in the valid span of Unicode letters.
        if (isValidLetter(letter)) {
            // Prepare start and end boundary-points.
            var start = index;
            var end = index;
            // Expand the selection left.
            while (start > 0 && isValidLetter(data.substring(start - 1, start))) {
                start = start - 1;
            }
            // Expand the selection right.
            while (end <= data.length - 1 && isValidLetter(data.substring(end, end + 1))) {
                end = end + 1;
            }
            // Get the full word.
            var word = data.substring(start, end);
            // Select the word in the browser.
            selection.collapse(range.startContainer, start);
            selection.extend(range.endContainer, end);

            // Initialize the form
            changeWord(word, selection);
        }
    }
}

function ipaFocusHandler() {
    var text = $('#ipa').val();
    text = text.replace(/[\[\]]/g, '');
    $('#ipa').val(text);
}

function ipaFocusOutHandler() {
    var text = $('#ipa').val();
    text = '[' + text + ']';
    $('#ipa').val(text);
}

function grammaticalCategoryHandler(data) {

    console.info("grammaticalCategoryHandler() called.");

    // For each grammatical category
    $.each(data, function(key, val) {

        // Get number of columns
        var numberOfColumns = 3;
        switch (val.grammemes.length) {
            case 0:
            case 1:
                numberOfColumns = 1;
                break;
            case 2:
            case 4:
                numberOfColumns = 2;
                break;
        }

        // Get number of rows
        var numberOfRows = 1;
        var buttonsOnLastRow = 0;
        var remainingSpacesOnLastRow = 0;
        if (val.grammemes.length > numberOfColumns) {
            buttonsOnLastRow = val.grammemes.length % numberOfColumns;
            remainingSpacesOnLastRow = numberOfColumns - buttonsOnLastRow;
            numberOfRows = (val.grammemes.length - buttonsOnLastRow) / numberOfColumns;
        }

        // Create new fieldset
        var $fieldset = $('<fieldset class="col-' + numberOfColumns + '" data-selected="no" />');
        var $legend = $('<legend>' + val.name + '</legend>');
        var $div = $('<div />');
        $fieldset.append($legend);
        $fieldset.append($div);
        var $button;

        // If there are grammemes
        if (val.grammemes.length > 0) {
            for (var i = 0; i < val.grammemes.length; i++) {
                $button = $('<button type="button" />');
                $button.addClass(val.grammemes[i].name);
                $button.val(val.grammemes[i].id);
                $button.text(val.grammemes[i].name);
                $div.append($button);

                // TODO: Dividing buttons on multiple rows not implemented.

            }
        } else {
            $button = $('<button type="button" />');
            $button.addClass(val.name);
            $button.val(val.id);
            $button.text(val.name);
            $div.append($button);
        }

        // Append new fieldset to <div id="fieldsets">
        $('#fieldsets').append($fieldset);
    });
}

// Toggle the data-selected attribute on the <fieldset> grandparent.
// If there are siblings, toggle between expanding the clicked button
// to fill the whole fieldset, and contracting it to show all buttons.
function buttonClickhandler(event) {

    // Get properties if this call
    var $cell = $(event.target);
    var $fieldset = $cell.parent().parent();
    var $row = $cell.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();
    var duration = 400;

    // If data is not selected
    if ($fieldset.attr('data-selected') === 'no') {
        $fieldset.attr('data-selected', 'yes');
        if ($siblingCells.length === 0) {
            return;
        }
        $(function () {
            $siblingRows.animate(
                { height: '0px' },
                { duration: duration, queue: false }
            );
            $cell.animate(
                { width: '100%' },
                { duration: duration, queue: false }
            );
            $siblingCells.animate(
                { width: '0%' },
                { duration: duration, queue: false }
            );
        });
    } else {
        $fieldset.attr('data-selected', 'no');
        if ($siblingCells.length === 0) {
            return;
        }
        $(function () {
            $siblingRows.animate(
                { height: '60px' },
                { duration: duration, queue: false }
            );
            $cell.animate(
                { width: (100 / ($siblingCells.length + 1)) + '%' },
                { duration: duration, queue: false }
            );
            $siblingCells.animate(
                { width: (100 / ($siblingCells.length + 1)) + '%' },
                { duration: duration, queue: false }
            );
        });
    }
}

// Handle clicks on any button
function lexicalCategoryHandler(event) {

    // Get properties if this call
    var $cell = $(event.target);
    var $fieldset = $cell.parent().parent();

    // If a lexical category has been selected.
    if ($fieldset.attr('data-selected') === 'yes') {
        // Remove all lexical category specific fieldsets.
        $('#fieldsets').empty();
    } else {
        var settings = {
            dataType: 'json',
            url: 'http://localhost:3000/api/grammatical_category',
            data: {
                lexical_category: $cell.val(),
                language: $('article').attr('lang')
            },
            success: function (data) {
                grammaticalCategoryHandler(data);
            }
        };
        $.get(settings);
    }
}

$(document).ready(function () {

    console.info("$(document).ready() called.");

    // Handle clicks in the <article> element
    $('article').on('click', articleClickHandler);

    // Handle focus/focusout on IPA
    $('#ipa').on({
        focus: ipaFocusHandler,
        focusout: ipaFocusOutHandler
    });

    // Handle any button clicks in form
    $('#lexical-category').on('click', 'button', lexicalCategoryHandler);
    $('form').on('click', 'button', buttonClickhandler);

});
