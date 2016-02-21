'use strict';

const SELECTION_MAX_LENGTH = 100;

function isValidLetter(character) {
    character = character.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (character !== '');
}

// Change the text smoothly, using fadeOut() and fadeIn()
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

    // Highlight the word in the text
    //highlightWord($cell.attr('class'));

}

function selectionHandler() {
    console.info('A mouseup event fired.');

    /* NOTE: This code assumes that whitespace has been normalized, so that
             there are no TAB, LF or CR characters and no consecutive spaces. */

    // Get selection object
    var selection = window.getSelection();

    // Make sure anchor and focus nodes are the same
    if (selection.anchorNode !== selection.focusNode) {
        console.warn('The anchor and focus nodes are different.');
        selection.removeAllRanges();
        return;
    }

    // Get anchor node object
    var node = selection.anchorNode;

    // Make sure it's a text node
    if (node.nodeType !== 3) {
        console.warn('The node is not a text node.');
        selection.removeAllRanges();
        return;
    }

    // Get start and end of selection
    var start = selection.anchorOffset;
    var end = selection.focusOffset;

    // Make sure we got a proper mousedown-drag-mouseup selection
    if (start === end) {
        console.warn('At least one character must be selected.');
        selection.removeAllRanges();
        return;
    }

    // Reverse start and end if user made a backwards selection
    if (start > end) {
        var temp = end;
        end = start;
        start = temp;
    }

    // Make sure selection is not too long
    if ((end - start) > SELECTION_MAX_LENGTH) {
        console.warn('The selection is too long.');
        selection.removeAllRanges();
        return;
    }

    // Get selected text
    var selectedText = node.nodeValue.substring(start, end);

    // Make sure all characters in selection are valid letters or spaces
    var hasSpaces = false;
    var numberOfValidLetters = 0;
    for (var i = 0; i < selectedText.length; i++) {
        if (isValidLetter(selectedText[i]) || selectedText[i] === ' ') {
            if (selectedText[i] !== ' ') {
                numberOfValidLetters++;
            } else {
                hasSpaces = true;
            }
        } else {
            console.warn('The selection contains invalid characters.');
            selection.removeAllRanges();
            return;
        }
    }

    // Contract selection left and right to trim spaces
    while (start > 0 && node.nodeValue.substring(start, start + 1) === ' ') {
        start++;
    }
    while (end <= node.nodeValue.length - 1 && node.nodeValue.substring(end - 1, end) === ' ') {
        end--;
    }

    // Expand selection left and right to include valid letters
    while (start > 0 && isValidLetter(node.nodeValue.substring(start - 1, start))) {
        start--;
    }
    while (end <= node.nodeValue.length - 1 && isValidLetter(node.nodeValue.substring(end, end + 1))) {
        end++;
    }

    // Adjust selection
    selection.collapse(node, start);
    selection.extend(node, end);

    // Make sure selection has at least one valid letter
    if (numberOfValidLetters === 0) {
        console.warn('The selection must have at least one valid letter.');
        selection.removeAllRanges();
        return;
    }

    // Get adjusted selected text
    var adjustedSelectedText = node.nodeValue.substring(start, end);
    console.info('A selection was made: %s (%d:%d)', adjustedSelectedText, start, end);
}

function highlightHandler() {

}

$(document).ready(function () {

    console.info("$(document).ready() called!");

    // Handle selections in the <article> element
    $('article').on('mouseup', selectionHandler);

    // Test highlighting
    $('#highlight').on('click', highlightHandler);

    // Handle focus/focusout on IPA
    $('#ipa').on({
        focus: ipaFocusHandler,
        focusout: ipaFocusOutHandler
    });

    // Handle any button clicks in form
    $('#lexical-category').on('click', 'button', lexicalCategoryHandler);
    $('form').on('click', 'button', buttonClickhandler);

});
