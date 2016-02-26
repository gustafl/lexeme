'use strict';

// Constants
const SELECTION_MAX_LENGTH = 100;
const CASE_SENSITIVE_MATCHING = false;

// Global variables
var _unsavedChanges = false;
var _lastUnsavedHighlight = null;
var _lastSelection = {
    node: null,
    start: 0,
    end: 0
}

function isValidLetter(character) {
    character = character.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (character !== '');
}

function changeWord(word, options) {

    console.info('changeWord() called: %s', word);

    // Display word in header
    $('#word').fadeOut(100, function () {
        $('#word').val(word);
        $('#word').fadeIn(100);
    });

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
    if (options.singleWord === true) {
        $('#lexical-category').slideDown();
    } else {
        $('#lexical-category').slideUp();
    }

    // Display 'Add translation' button
    $('#translation').slideDown();
}

function resetForm() {

    console.info('resetForm() called.');

    // Reset lexical category selection
    $('#lexical-category button[data-selected]').trigger('click');
    $('#lexical-category button[data-selected]').removeAttr('data-selected');
    $('#lexical-category').hide();

    // Hide 'Add translation' button
    $('#translation').hide();

    // Reset word
    $('#word').fadeOut(100, function () {
        $('#word').val('Select a word');
        $('#word').fadeIn(100);
    });

    // Reset IPA
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
    $('#save').fadeOut(100);

    // If there's an unsaved highlight, remove it
    if (_lastUnsavedHighlight) {
        _lastUnsavedHighlight.contents().unwrap();
        _lastUnsavedHighlight = null;
    }

    // Forget about unsaved changes
    _unsavedChanges = false;
}

function selectionHandler() {

    console.info('selectionHandler() called.');

    /**
     * NOTE: This code assumes that whitespace has been normalized, so that
     * there are no TAB, LF or CR characters and no consecutive spaces.
     */

     // Get selection object
    var selection = window.getSelection();

    // Get anchor node object
    var node = selection.anchorNode;

    // Make sure anchor and focus nodes are the same
    if (selection.anchorNode !== selection.focusNode) {
        console.warn('The anchor and focus nodes are different.');
        selection.removeAllRanges();
        return;
    }

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

    // If a new selection is made with unsaved changes
    if (_unsavedChanges) {
        // Reset form
        resetForm();
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

    // Move selection start right until the first non-space character
    while (start > 0 && node.nodeValue.substring(start, start + 1) === ' ') {
        start++;
    }

    // Move selection end left until the first non-space character
    while (end <= node.nodeValue.length - 1 && node.nodeValue.substring(end - 1, end) === ' ') {
        end--;
    }

    // Move selection start left while there are valid letters
    while (start > 0 && isValidLetter(node.nodeValue.substring(start - 1, start))) {
        start--;
    }

    // Move selection end right while there are valid letters
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

    // Adjust form according to selection
    if (!selectionHasSpaces) {
        changeWord(adjustedSelectedText, { singleWord: true });
    } else {
        changeWord(adjustedSelectedText, { singleWord: false });
    }

    // Save last selection
    _lastSelection.node = node;
    _lastSelection.start = start;
    _lastSelection.end = end;
}

function ipaFocusHandler() {

    console.info('ipaFocusHandler() called.');

    var text = $('#ipa').val();
    text = text.replace(/[\[\]]/g, '');
    $('#ipa').val(text);
}

function ipaFocusOutHandler() {

    console.info('ipaFocusOutHandler() called.');

    var text = $('#ipa').val();
    text = '[' + text + ']';
    $('#ipa').val(text);
}

function singleSelectClickHandler(event) {

    console.info('singleSelectClickHandler() called.');

    /**
     * NOTE: This code assumes the following structure:
     *
     * <fieldset>
     *   <div><button /> ... </div>
     *   ...
     * </fieldset>
     */

     // Get properties for this call
     var $cell = $(event.target);
     var $row = $cell.parent();
     var $fieldset = $row.parent();
     var $siblingRows = $row.siblings();
     var $siblingCells = $cell.siblings();
     var duration = 200;

    // If the button clicked is located in a single-select fieldset
    if ($fieldset.attr('data-type') === 'single-select') {
        // If the clicked button has no 'data-selected' attribute
        if ($cell.attr('data-selected') === undefined) {
            // Set the 'data-selected' attribute
            $cell.attr('data-selected', true);
            if ($siblingCells.length === 0 && $siblingRows.length === 0) {
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
            // Remove the 'data-selected' attribute
            $cell.removeAttr('data-selected');
            if ($siblingCells.length === 0 && $siblingRows.length === 0) {
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

function multiSelectClickHandler(event) {

    console.info('multiSelectClickHandler() called.');

    /**
     * NOTE: This code assumes the following structure:
     *
     * <fieldset>
     *   <div><button /> ... </div>
     *   ...
     * </fieldset>
     */

     // Get properties for this call
     var $cell = $(event.target);
     var $row = $cell.parent();
     var $fieldset = $row.parent();

    // If the button clicked is located in a single-select fieldset
    if ($fieldset.attr('data-type') === 'multi-select') {
        // If the button clicked has no 'data-selected' attribute
        if ($cell.attr('data-selected') === null) {
            // Set the 'data-selected' attribute on the clicked button
            $cell.attr('data-selected', true);
        } else {
            $cell.attr('data-selected', false);
        }
    }
}

// Handle clicks on any button
function lexicalCategoryHandler(event) {

    console.info('lexicalCategoryHandler() called.');

    // Get properties for this call
    var $cell = $(event.target);
    var $fieldset = $cell.parents('fieldset');
    var id = $cell.attr('data-lc-id');
    var duration = 400;

    // If a lexical category is already selected
    if ($cell.attr('data-selected') !== undefined) {

        /**
         * NOTE: If the user clicks a lexical category button with a data-select
         * attribute, it means he/she wants to cancel the previous selection. In this
         * case, this happens:
         *
         * 1. the grammatical categories disappear
         * 2. the save button disappears
         * 3. the last highlight is removed, unless it's already saved
         * 4. the last selection is restored
         *
         * The lexical category buttons also have the singleSelectClickHandler().
         * So apart from the steps above, these things happen:
         *
         * 5. the lexical category fieldset resets
         * 6. the 'data-selected' attribute on the clicked button disappears
         */

        // Hide the associated <div>
        $('div[data-lc-id="' + id + '"]').slideUp(duration, function () {
            // Remove Save button
            $('#save').disable();
            $('#save').fadeOut(100);
        });

        // If there's an unsaved highlight, remove it
        if (_lastUnsavedHighlight) {
            _lastUnsavedHighlight.contents().unwrap();
            _lastUnsavedHighlight = null;
        }

        // Redo last selection
        if (_lastSelection.node !== null) {
            _lastSelection.node.parentElement.normalize();
            var range = document.createRange();
            range.setStart(_lastSelection.node, _lastSelection.start);
            range.setEnd(_lastSelection.node, _lastSelection.end);
            var selection = window.getSelection();
            selection.addRange(range);
        }

    } else {

        // Show the associated <div>
        $('div[data-lc-id="' + id + '"]').slideDown(duration, function () {
            // Show Save button
            $('#save').enable();
            $('#save').fadeIn(100);
        });

        // Highlight the word in the text
        var lexicalCategory = $cell.attr('class');
        highlightWord(lexicalCategory);

        /**
         * NOTE: By selecting the lexical category, we now have unsaved data associated with
         * this word. Therefore, we set the _unsavedChanges flag here. The lexical category
         * is the least amount of data you can save with a single word.
         */

        _unsavedChanges = true;
    }
}

function highlightWord(lexicalCategory) {

    console.info('highlightWord() called.');

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
        _lastUnsavedHighlight = $(span);

        /**
         * TODO: Look for other instances of the selection and highlight them too.
         */
    }
}

function saveForm() {

    console.info('saveForm() called.');

    // Get LocalStorage object
    var storage = window.localStorage;

    // If lexeme doesn't exists
    var lexeme = $('#word').val();
    if (storage[lexeme] === undefined) {
        // Add new lexeme
        var lexemeRecord = {};
        lexemeRecord.lcid = $('#lexical_category').find('button[data-selected]').attr('data-lc-id');
        lexemeRecord.la = $('article').attr('lang');
        lexemeRecord.sp = lexeme;
        lexemeRecord.pr = $('#ipa').val();
        lexemeRecord.gc = [];
        $('#fieldsets').find('fieldset[data-lexeme-related]').each('button[data-selected]', function () {
            // TODO: Handle multi-select fieldsets too.
            var grammaticalCategory = {
                gcid: $(this).parents('fieldset').attr('data-gc-id'),
                grid: $(this).attr('data-gr-id')
            };
            lexemeRecord.gc.push(grammaticalCategory);
        });
        var key = 'lexeme.' + lexeme;
        var value = JSON.stringify(lexemeRecord);
        storage[key] = value;
    }

    // Persist translations and inflections in the DOM while working on a word.
    // Show translations and

    // Add new inflection(s)
    var inflectionRecord = {};
    inflectionRecord.ls = $('#lexical_category').find('button[data-selected]').attr('data-lc-id');
    inflectionRecord.sp = lexeme;
    inflectionRecord.pr = $('#ipa').val();
    inflectionRecord.gc = [];
    $('#fieldsets').find('fieldset:not([data-lexeme-related])').each('button[data-selected]', function () {
        // TODO: Handle multi-select fieldsets too.
        var grammaticalCategory = {
            gcid: $(this).parents('fieldset').attr('data-gc-id'),
            grid: $(this).attr('data-gr-id')
        };
        inflectionRecord.gc.push(grammaticalCategory);
    });
    var key = 'lexeme.' + lexeme;
    var value = JSON.stringify(inflectionRecord);
    storage[key] = value;

    // Add new translation(s)

    resetForm();
}

function addTranslationHandler(event) {

    console.info('singleSelectClickHandler() called.');

    /**
     * NOTE: This code assumes the following structure:
     *
     * <fieldset>
     *   <div><button /> ... </div>
     *   ...
     * </fieldset>
     */

     // Get properties for this call
     var $cell = $(event.target);
     var $row = $cell.parent();
     var $fieldset = $row.parent();
     var duration = 400;

     // Create an <input> element to type the translation in
     var $input = $('<input type="text" autocomplete="off" maxlength="100" style="display: none" />');
     $row.append($input);

    // If the clicked button has no 'data-selected' attribute
    if ($cell.attr('data-selected') === undefined) {
        $cell.attr('data-selected', true);
        $row.css('text-align', 'right');
        $input.fadeIn(1000, function () {
            $input.focus();
        });
        $(function () {
            $cell.animate(
                { width: '33%' },
                { duration: duration, queue: false, complete: function () {


                }}
            );
            $input.animate(
                { width: '65%' },
                { duration: duration, queue: false }
            );
        });
    } else {
        $cell.removeAttr('data-selected');
        $input.fadeOut(1000, function () {

        });
        $input.fadeOut(1000, function() {
            $('#translation input').remove();
            $(function () {
                $cell.animate(
                    { width: '100%' },
                    { duration: duration, queue: false, complete: function () {
                        $row.css('text-align', '');
                    }}
                );
                $input.animate(
                    { width: '0%' },
                    { duration: duration, queue: false }
                );
            });
        });
    }
}

function loadLanguageConfiguration(data) {

    console.info('loadLanguageConfiguration() called.');

    // Get data from local storage
    var storage = window.localStorage;
    var languageCode = $('article').attr('lang');
    var data = JSON.parse(storage['config.' + languageCode]);

    // For each lexical category
    $.each(data, function(lc, lexicalCategory) {

        // Find the prepared div for this lexical category
        var div = $('form div[data-lc-id="' + lexicalCategory.id + '"]');

        // For each grammatical category
        $.each(lexicalCategory.grammaticalCategories, function (gc, grammaticalCategory) {

            // Get grammatical category properties
            var subgroup = grammaticalCategory.subgroup
            var numberOfGrammmemes = grammaticalCategory.grammemes.length;

            // Get number of columns
            var numberOfColumns = 3;
            switch (numberOfGrammmemes) {
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
            if (numberOfGrammmemes > numberOfColumns) {
                buttonsOnLastRow = numberOfGrammmemes % numberOfColumns;
                remainingSpacesOnLastRow = numberOfColumns - buttonsOnLastRow;
                numberOfRows = (numberOfGrammmemes - buttonsOnLastRow) / numberOfColumns;
            }

            // Create new fieldset
            var $fieldset = $('<fieldset />');
            $fieldset.addClass('col-' + numberOfColumns);
            $fieldset.attr('data-gc-id', grammaticalCategory.id);
            $fieldset.attr('data-gc-subgroup', grammaticalCategory.subgroup);

            // Add legend to fieldset
            var $legend = $('<legend>' + grammaticalCategory.name + '</legend>');
            $fieldset.append($legend);

            // Add div to fieldset
            var $div = $('<div />');
            $fieldset.append($div);
            var $button;

            // If there are grammemes
            if (numberOfGrammmemes > 0) {

                // Set fieldset to type 'single-select'
                $fieldset.attr('data-type', 'single-select');

                // For each grammeme
                $.each(grammaticalCategory.grammemes, function (gr, grammeme) {
                    $button = $('<button type="button" />');
                    $button.addClass(lexicalCategory.name + '-property');
                    $button.attr('data-gr-id', grammeme.id);
                    $button.text(grammeme.name);
                    $div.append($button);
                    // TODO: Dividing buttons on multiple rows not implemented.
                });
            } else {
                $fieldset.attr('data-type', 'multi-select');
                $button = $('<button type="button" />');
                $button.addClass(lexicalCategory.name + '-property');
                $button.text(grammaticalCategory.name);
                $div.append($button);
            }

            // Append new fieldset to <div id="fieldsets">
            div.append($fieldset);
        });
    });
}

function adaptToLanguage(languageCode) {

    // Make sure we didn't already load this
    var storage = window.localStorage;
    var key = 'config.' + languageCode;
    if (storage[key] !== undefined) {
        loadLanguageConfiguration();
        return;
    }

    // Prepare AJAX call
    var settings = {
        dataType: 'json',
        url: 'http://localhost:3000/api/grammatical_category',
        data: {
            language: languageCode
        },
        success: function (data) {
            storage[key] = JSON.stringify(data);
            loadLanguageConfiguration();
        }
    };

    // Make AJAX call
    $.get(settings);

}

$(document).ready(function () {

    console.info("$(document).ready() called!");

    // Load languages-specific buttons from Local Storage or AJAX
    var languageCode = $('article').attr('lang');
    adaptToLanguage(languageCode);

    // Handle selections in the <article> element
    $('article').on('mouseup', selectionHandler);

    // Handle clicks on the application buttons
    $('#save').on('click', saveForm);
    $('#close').on('click', resetForm);

    // Handle Add translation
    $('#translation').on('click', 'button', addTranslationHandler);

    // Handle focus/focusout on IPA
    $('#ipa').on({
        focus: ipaFocusHandler,
        focusout: ipaFocusOutHandler
    });

    // Handle any button clicks in form
    $('#lexical-category').on('click', 'button', lexicalCategoryHandler);
    $('form').on('click', 'fieldset[data-type="single-select"] button', singleSelectClickHandler);
    $('form').on('click', 'fieldset[data-type="multi-select"] button', multiSelectClickHandler);

    // jQuery extension to disable/enable buttons
    // Usage: $('button').disable(true);
    jQuery.fn.extend({
        disable: function () {
            return this.each(function () {
                this.disabled = true;
            });
        },
        enable: function () {
            return this.each(function () {
                this.disabled = false;
            });
        }
    });

});
