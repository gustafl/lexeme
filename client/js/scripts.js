'use strict';

// Constants
const SELECTION_MAX_LENGTH = 100;
const CASE_SENSITIVE_MATCHING = false;

// Global variables
var $unsavedChanges = false;
var $lastHightlight = null;

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

function changeWord(word, options) {

    console.info("changeWord('%s') called with options: %O", word, options);

    // Display word in header
    changeContent('#word', word);

    // Display the IPA field
    var height = parseInt($('fieldset.header').css('height'));
    if (height < 160) {
        $('fieldset.header').animate(
            { height: '160px' }, // TODO: Adapt to screen resolution
            { duration: 250, queue: false, complete: function () {
                $('#ipa').fadeIn(100);
            }}
        );
    }

    // Display lexical categories buttons
    if (options.single === true) {
        $('#lexical-category').slideDown();
    } else {
        $('#lexical-category').slideUp();
    }

    // Display 'Add translation' button
    $('#translation').slideDown();
}

function resetForm() {

    // Reset lexical category selection
    $('#lexical-category button[style="width: 100%;"]').trigger('click');
    $('#lexical-category').attr('data-selected', 'no');
    $('#lexical-category').hide();

    // Hide 'Add translation' button
    $('#translation').hide();

    // Reset top fieldset
    changeContent('#word', 'Select a word');
    $('#ipa').hide();
    var height = parseInt($('fieldset.header').css('height'));
    if (height === 160) {
        $('fieldset.header').animate(
            { height: '97px' }, // TODO: Adapt to screen resolution
            { duration: 250, queue: false }
        );
    }

    // Remove grammatical categories
    $('#fieldsets').slideUp();
    $('#fieldsets').empty();

    // Remove Save button
    $('#save').hide();

    // Set unsavedChanges flag
    $unsavedChanges = false;
}

function selectionHandler() {

    console.info('A mouseup event fired.');

    /* NOTE: This code assumes that whitespace has been normalized, so that
             there are no TAB, LF or CR characters and no consecutive spaces. */

    // If a new selection is made with unsaved changes
    if ($unsavedChanges) {
        // Remove last highlight
        $lastHightlight.contents().unwrap();
        // Reset form
        resetForm();
        // Set unsaved changes flag
        $unsavedChanges = false;
    }

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

    // Make sure the parent of this textnode is not a <span>
    if (node.parentNode.nodeName === 'SPAN') {
        console.warn('There is already a highlight here.');
        selection.removeAllRanges();
        return;
    }

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

    // Get selected text
    var selectedText = node.nodeValue.substring(start, end);

    // Make sure all characters in selection are valid letters or spaces
    var selectionHasSpaces = false;
    var numberOfValidLetters = 0;
    for (var i = 0; i < selectedText.length; i++) {
        if (isValidLetter(selectedText[i]) || selectedText[i] === ' ') {
            if (selectedText[i] !== ' ') {
                numberOfValidLetters++;
            } else {
                selectionHasSpaces = true;
            }
        } else {
            console.warn('The selection contains invalid characters.');
            selection.removeAllRanges();
            return;
        }
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

    // Adjust form according to selection
    if (!selectionHasSpaces) {
        changeWord(adjustedSelectedText, { single: true });
    } else {
        changeWord(adjustedSelectedText, { single: false });
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

function grammaticalCategoryHandler(data, lexicalCategory) {

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
        var $fieldset = $('<fieldset class="col-' + numberOfColumns + '" data-button-type="radio" data-selected="no" />');
        var $legend = $('<legend>' + val.name + '</legend>');
        var $div = $('<div />');
        $fieldset.append($legend);
        $fieldset.append($div);
        var $button;

        // If there are grammemes
        var className = lexicalCategory + '-property';
        if (val.grammemes.length > 0) {
            for (var i = 0; i < val.grammemes.length; i++) {
                $button = $('<button type="button" />');
                $button.addClass(className);
                $button.val(val.grammemes[i].id);
                $button.text(val.grammemes[i].name);
                $div.append($button);

                // TODO: Dividing buttons on multiple rows not implemented.

            }
        } else {
            $button = $('<button type="button" />');
            $button.addClass(className);
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
function radioButtonClickHandler(event) {

    var $cell = null;
    if (event !== undefined) {
        $cell = $(event.target);
    } else {
        $cell = $('button[style="width: 100%;"]')[0];
    }
    var $fieldset = $cell.parent().parent();
    var $row = $cell.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();
    var duration = 400;

    // If data is not selected
    if ($fieldset.attr('data-button-type') === 'radio') {
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
}

// Handle clicks on any button
function lexicalCategoryHandler(event) {

    // Get properties of this call
    var $cell = $(event.target);
    var $fieldset = $cell.parent().parent();
    var lexicalCategory = $cell.attr('class');

    // If a lexical category has been selected
    if ($fieldset.attr('data-selected') === 'yes') {
        // Remove all lexical category specific fieldsets
        $('#fieldsets').empty();
        // Remove last highlight
        //$lastHightlight.contents().unwrap();
        // Remove Save button
        $('#save').hide();
        // Set unsavedChanges flag
        $unsavedChanges = false;
    } else {
        var settings = {
            dataType: 'json',
            url: 'http://localhost:3000/api/grammatical_category',
            data: {
                lexical_category: $cell.val(),
                language: $('article').attr('lang')
            },
            success: function (data) {
                grammaticalCategoryHandler(data, lexicalCategory);
            }
        };
        $.get(settings);
        // Highlight the word in the text
        highlightWord(lexicalCategory);
        // Show Save button
        $('#save').show();
        // Set unsavedChanges flag
        $unsavedChanges = true;
    }
}

function highlightWord(lexicalCategory) {

    // Get Selection object
    var selection = window.getSelection();

    // Make sure we got a selection
    if (selection.rangeCount > 0) {

        // Get selected text
        var node = selection.anchorNode;
        var start = selection.anchorOffset;
        var end = selection.focusOffset;
        var searchText = node.nodeValue.substring(start, end);

        // Wrap selection in a span with the right class
        var range = selection.getRangeAt(0);
        var selectedText = range.extractContents();
        var span = document.createElement('span');
        span.classList.add(lexicalCategory);

        // Insert span in textnode
        span.appendChild(selectedText);
        range.insertNode(span);

        // Remove selection to show highlight
        selection.removeAllRanges();

        // Save last highlight (in case we need to undo it)
        $lastHightlight = $(span);

        // Look for other instances of the selection and highlight them too
        var $paragraphs = $('article p');
        $paragraphs.each(function () {
            // Get element
            var paragraph = $(this);
            // Get all textnode children of element
            var $textNodes = paragraph.contents().filter(function() {
                return this.nodeType === 3;
            });
            // Loop through textnodes
            $textNodes.each(function () {
                // Current textnode
                var $textNode = $(this);
                // NOTE: As soon as the text is wrapped in a <span>, it will disappear from the textnode
                // and therefore not be found in the next iteration.
                var regex = new RegExp('[^\w]*' + searchText + '[^\w]*', 'ig');
                var array = [];
                while ((array = regex.exec(searchText)) !== null) {
                    var message = 'Found ' + array[0] + '. ';
                    var nextMatchIndex = regex.lastIndex;
                    message += 'Next match starts at ' + nextMatchIndex;
                    console.log(message);
                    /*var start = $textNode.text().indexOf(searchText);
                    var end = start + searchText.length;
                    highlightWordInElement($textNode, start, end);*/
                }
            });

        });
    }
}

function saveForm() {
    resetForm();
}

function highlightWordInElement(textNode, start, end) {
    console.log(textNode.nodeValue, start, end);
}

$(document).ready(function () {

    console.info("$(document).ready() called!");

    // Handle selections in the <article> element
    $('article').on('mouseup', selectionHandler);

    $('#close').on('click', resetForm);

    $('#save').on('click', saveForm);

    // Handle focus/focusout on IPA
    $('#ipa').on({
        focus: ipaFocusHandler,
        focusout: ipaFocusOutHandler
    });

    // Handle any button clicks in form
    $('#lexical-category').on('click', 'button', lexicalCategoryHandler);
    $('form').on('click', 'fieldset[data-button-type="radio"] button', radioButtonClickHandler);

});
