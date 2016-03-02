'use strict';

// Constants
const SELECTION_MAX_LENGTH = 100;
const CASE_SENSITIVE_MATCHING = false;
const DURATION_FADE = 100;
const DURATION_SLIDE = 400;
const DURATION_WIDTH = 200;
const LETTER = 'a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF';

/**
 * Keeps track of whether there are currently unsaved changes in the application.
 * @type {Boolean}
 */
window.unsavedChanges = false;

/**
 * Keeps track of where the last highlight was made (in case it needs to be
 * changed or undone).
 * @type {Object}
 * @property {Node}    element - A <span> element (jQuery) containing the highlight.
 * @property {boolean} saved   - A boolean indicating if the highlight has been saved.
 */
window.lastHighlight = {
    element: null,
    saved: false
}

/**
 * Keeps track of where the last selection was made (in case it loses focus).
 * @type {Object}
 * @property {Node}   node  - The node in which the selection was made.
 * @property {number} start - The start offset of the selection.
 * @property {number} end   - The end offset of the selection.
 */
window.lastSelection = {
    node: null,
    start: 0,
    end: 0
}

/**
 * Keeps track of which translation languages he user have selected, and in what
 * order. The variable stores the language codes in an array with the last selected
 * language first.
 * @type {Array}
 */
window.lastLanguage = ['en', 'fr', 'sv'];  // TODO: Make a user setting for this.

function format(text) {

    // Make sure we got a string
    if (typeof text !== 'string') {
        throw Error('This method only accepts strings.');
    }

    // Make sure we got at least one replacement argument
    if (arguments.length < 2) {
        // Otherwise return the string as we got it
        return text;
    }

    // Define pattern to look for
    var regex = /%s/g;

    // Loop through the replacement arguments
    for (var i = 1; i < arguments.length; i++) {
        text = text.replace(regex, arguments[i]);
    }

    return text;
};

function isValidLetter(character) {
    character = character.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (character !== '');
}

function removeLastHightlight(replaceWithSelection) {

    console.info('removeLastHightlight() called: %s', word);

    // Make sure there is a last highlight
    if (window.lastHighlight.element === null) {
        return;
    }

    // If we are not replacing a highlight with a selection
    if (!replaceWithSelection) {
        // Make sure the highlight is not saved
        if (!window.lastHighlight.saved) {
            window.lastHighlight.element.contents().unwrap();
            window.lastHighlight.element = null;
        }
    } else {

        // Get properties of currently highlighted <span>
        var span = window.lastHighlight.element[0];
        var spanTextNode = span.firstChild;
        var originalLength = spanTextNode.length;
        var parentElement = span.parentElement;
        var spanOffset = 0;

        /**
         * NOTE: Instead of normalizing the parent block element and losing bearings of
         * where we are, we normalize the text nodes manually here, by concatenating any
         * previous and next sibling text nodes into the <span> text node, and then
         * removing the siblings.
         */

        // Get previous sibling text node (if any)
        var previousSiblingTextNode = null;
        if (span.previousSibling !== null && span.previousSibling.nodeType === 3) {
            previousSiblingTextNode = span.previousSibling;
            spanOffset = span.previousSibling.length;
        }

        // Get next sibling text node (if any)
        var nextSiblingTextNode = null;
        if (span.nextSibling !== null && span.nextSibling.nodeType === 3) {
            nextSiblingTextNode = span.nextSibling;
        }

        // Remove the highlight
        window.lastHighlight.element.contents().unwrap();
        window.lastHighlight.element = null;

        // Concatenate the previous text node into the <span>
        if (previousSiblingTextNode !== null) {
            var text = previousSiblingTextNode.nodeValue + spanTextNode.nodeValue;
            parentElement.removeChild(previousSiblingTextNode);
            spanTextNode.nodeValue = text;
        }

        // Concatenate the next text node into the <span>
        if (nextSiblingTextNode !== null) {
            var text = spanTextNode.nodeValue + nextSiblingTextNode.nodeValue;
            parentElement.removeChild(nextSiblingTextNode);
            spanTextNode.nodeValue = text;
        }

        // Restore selection
        var textNode = spanTextNode;
        var range = document.createRange();
        range.setStart(textNode, spanOffset);
        range.setEnd(textNode, spanOffset + originalLength);
        var selection = window.getSelection();
        selection.addRange(range);
    }
}

function changeWord(word) {

    console.info('changeWord() called: %s', word);

    // Display word in header
    $('#word').fadeOut(DURATION_FADE, function () {
        $('#word').val(word);
        $('#word').fadeIn(DURATION_FADE);
    });

    /**
     * NOTE: The IPA feature is postponed to at least version 0.3.0.
     */

    // Display the IPA field
    //$('#ipa').fadeIn(DURATION_FADE);

    var $fieldset = $('#lexical-category');
    var selectedButtons = $fieldset.find('button[data-selected]');

    // If a lexical category is already selected
    if (selectedButtons.length > 0) {
        var $cell = selectedButtons.first();
        var lexicalCategoryId = $cell.attr('data-lc-id');
        // Reset lexical category selection
        singleSelectReset($fieldset);
        // Remove last highlight (unless it's saved)
        removeLastHightlight();
        // Hide grammatical categories
        $('div[data-lc-id="' + lexicalCategoryId + '"]').slideUp(DURATION_SLIDE, function () {
            // Hide save button
            $('#save').disable();
            $('#save').fadeOut(DURATION_FADE);
        });
    } else {
        $('#lexical-category').slideDown(DURATION_SLIDE);
    }

    // Display 'Add translation' button
    $('#add-translation').slideDown(DURATION_SLIDE);

    // Set header background color
    $('fieldset.header').addClass('default');
}

function selectionHandler() {

    console.info('selectionHandler() called.');

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
        //console.warn('There is already a highlight here.');
        selection.removeAllRanges();
        //loadLexeme(node.textContent);
        var wordBubble = $('#word-bubble');
        var position = wordBubble.position();
        $('#word-bubble-position').text('top: ' + position.top + ', left: ' + position.left);
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

    // Get selected text
    var selectedText = node.nodeValue.substring(start, end);

    // Make sure all characters in selection are valid letters or spaces
    var numberOfValidLetters = 0;
    for (var i = 0; i < selectedText.length; i++) {
        if (isValidLetter(selectedText[i]) || selectedText[i] === ' ') {
            if (selectedText[i] !== ' ') {
                numberOfValidLetters++;
            }
        } else {
            console.warn('The selection contains invalid characters.');
            selection.removeAllRanges();
            return;
        }
    }

    // Move selection start right until the first non-space character
    while (start >= 0 && node.nodeValue.substring(start, start + 1) === ' ') {
        start++;
    }

    // Move selection end left until the first non-space character
    while (end <= node.nodeValue.length && node.nodeValue.substring(end - 1, end) === ' ') {
        end--;
    }

    // Move selection start left while there are valid letters
    while (start >= 0 && isValidLetter(node.nodeValue.substring(start - 1, start))) {
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

    // Remember this selection (in case we need to restore it)
    window.lastSelection.node = node;
    window.lastSelection.start = start;
    window.lastSelection.end = end;

    // Adjust form according to selection
    changeWord(adjustedSelectedText);
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

    // If the button clicked is located in a single-select fieldset
    if ($fieldset.attr('data-type') !== 'single-select') {
        return;
    }

    // If the clicked button has no 'data-selected' attribute
    if ($cell.attr('data-selected') === undefined) {
        singleSelectSelect($cell);
    } else {
        singleSelectReset($fieldset);
    }

    // We now have unsaved changes
    window.unsavedChanges = true;
}

function singleSelectSelect($cell) {

    console.info('singleSelectSelect() called.');

    var $row = $cell.parent();
    var $fieldset = $row.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();

    // Set the 'data-selected' attribute
    $cell.attr('data-selected', true);
    if ($siblingCells.length === 0 && $siblingRows.length === 0) {
        return;
    }
    $(function () {
        $siblingRows.animate(
            { height: '0px' },
            { duration: DURATION_WIDTH, queue: false }
        );
        $cell.animate(
            { width: '100%' },
            { duration: DURATION_WIDTH, queue: false, complete: function () {
                if ($cell.parents('#lexical-category').length === 0) {
                    var currentClass = $cell.attr('class');
                    $cell.attr('class', currentClass.replace('-unselected', ''));
                }
            }}
        );
        $siblingCells.animate(
            { width: '0%' },
            { duration: DURATION_WIDTH, queue: false }
        );
    });
}

function singleSelectReset($fieldset) {

    console.info('singleSelectReset() called.');

    // Get the currently selected button
    var $cell = $fieldset.find('button[data-selected]').first();
    var $row = $cell.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();

    // Remove the 'data-selected' attribute
    $cell.removeAttr('data-selected');
    if ($siblingCells.length === 0 && $siblingRows.length === 0) {
        return;
    }
    $(function () {
        $siblingRows.animate(
            { height: '60px' },
            { duration: DURATION_WIDTH, queue: false }
        );
        $cell.animate(
            { width: (100 / ($siblingCells.length + 1)) + '%' },
            { duration: DURATION_WIDTH, queue: false, complete: function () {
                if ($cell.parents('#lexical-category').length === 0) {
                    var currentClass = $cell.attr('class');
                    $cell.attr('class', currentClass + '-unselected');
                }
            }}
        );
        $siblingCells.animate(
            { width: (100 / ($siblingCells.length + 1)) + '%' },
            { duration: DURATION_WIDTH, queue: false }
        );
    });
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
        // If the clicked button has no 'data-selected' attribute
        if ($cell.attr('data-selected') === undefined) {
            // Set the 'data-selected' attribute
            $cell.attr('data-selected', true);
            if ($cell.parents('#lexical-category').length === 0) {
                var currentClass = $cell.attr('class');
                $cell.attr('class', currentClass.replace('-unselected', ''));
            }
        } else {
            $cell.removeAttr('data-selected');
            if ($cell.parents('#lexical-category').length === 0) {
                var currentClass = $cell.attr('class');
                $cell.attr('class', currentClass + '-unselected');
            }
        }
    }

    // We now have unsaved changes
    window.unsavedChanges = true;
}

function lexicalCategoryHandler(event) {

    console.info('lexicalCategoryHandler() called.');

    // Get properties for this call
    var $cell = $(event.target);
    var $fieldset = $cell.parents('fieldset');
    var id = $cell.attr('data-lc-id');
    var className = $cell.attr('class');

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

        // TODO: Reset Root/Inflection choice and hide the <fieldset>

        // Reset background color in header
        $('fieldset.header').removeClass(className);
        $('fieldset.header').addClass('default');

        // Hide the associated <div>
        $('div[data-lc-id="' + id + '"]').slideUp(DURATION_SLIDE, function () {
            // Remove Save button
            $('#save').disable();
            $('#save').fadeOut(DURATION_FADE);
        });

        // If there's an unsaved highlight, remove it
        var replaceWithSelection = true;
        removeLastHightlight(replaceWithSelection);

    } else {

        // Set background color in header
        $('fieldset.header').removeClass('default');
        $('fieldset.header').addClass(className);

        // Show the root/inflection question
        $('#is-root').slideDown(DURATION_SLIDE, function () {
            // Show Save button
            $('#save').enable();
            $('#save').fadeIn(DURATION_FADE);
        });

        // Show the associated <div>
        /*$('div[data-lc-id="' + id + '"]').slideDown(duration, function () {
            // Show Save button
            $('#save').enable();
            $('#save').fadeIn(100);
        });*/

        // Highlight the word in the text
        var lexicalCategory = $cell.attr('class');
        highlightWord(lexicalCategory);

        /**
         * NOTE: By selecting the lexical category, we now have unsaved data associated with
         * this word, so we set the window.unsavedChanges flag. The lexical category is the least
         * amount of data you can save with a single word.
         */

        window.unsavedChanges = true;
    }
}

function highlightWord(lexicalCategory) {

    console.info('highlightWord() called.');

    // Get Selection object
    var selection = window.getSelection();

    // If there is no selection
    if (selection.rangeCount === 0) {
        // If there is a saved selection
        if (window.lastSelection.node !== null) {
            // Restore selection
            let node = window.lastSelection.node;
            let start = window.lastSelection.start;
            let end = window.lastSelection.end;
            var range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, start + (end - start));
            var selection = window.getSelection();
            selection.addRange(range);
        }
    }

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
    window.lastHighlight.element = $(span);
    window.lastHighlight.saved = false;

    /**
     * TODO: Look for other instances of the selection and highlight them too.
     */
}

function saveLexeme() {

    console.info('saveLexeme() called.');

    /**
     * NOTE: We may assume that a lexical category has been selected here. Otherwise
     * the Save button would be hidden.
     */

    // Prepare a lexeme object
    var lexeme = {};

    // Find <div> matching selected lexical category
    var lcid = $('#lexical-category').find('button[data-selected]').attr('data-lc-id');
    var div = $('div[data-lc-id="%s"]'.replace('%s', lcid));

    // Add basic lexeme data
    lexeme.lcid = lcid;
    lexeme.la = $('article').attr('lang');
    lexeme.sp = $('#word').val();
    var ipa = $('#ipa').val();
    lexeme.pr = (ipa !== '[IPA]') ? ipa : null;
    lexeme.gc = [];

    // For each <fieldset> child of <div>
    var fieldsets = div.children();
    fieldsets.each(function (index, element) {

        // Ignore fieldsets with wrong data-gc-subgroup values
        var fieldset = $(element);
        var subgroup = fieldset.attr('data-gc-subgroup');
        if (subgroup !== '1' && subgroup !== '3') {
            return true;
        }

        // Ignore fieldsets with no selected buttons
        var selectedButtons = fieldset.find('button[data-selected]');
        if (selectedButtons.length === 0) {
            return true;
        }

        // Get the fieldset type
        var fieldsetType = fieldset.attr('data-type');

        // If it's a single-select fieldset
        if (fieldsetType === 'single-select') {
            var selectedButton = selectedButtons.first();
            var grammaticalCategoryId = fieldset.attr('data-gc-id');
            var grammemeId = selectedButton.attr('data-gr-id');
            // Add selected button to grammatical categories array
            lexeme.gc.push({
                gcid: grammaticalCategoryId,
                grid: grammemeId
            });
            return true;
        }

        // If it's a multi-select fieldset
        if (fieldsetType === 'multi-select') {
            // For each selected button
            selectedButtons.each(function (index2, element2) {
                // Add selected button to grammatical categories array
                var selectedButton = $(element2);
                var grammaticalCategoryId = fieldset.attr('data-gc-id');
                var grammemeId = selectedButton.attr('data-gr-id');
                grammemeId = (grammemeId !== undefined) ? grammemeId : null;
                lexeme.gc.push({
                    gcid: grammaticalCategoryId,
                    grid: grammemeId
                });
            });
            return true;
        }
    });

    // Store lexeme object
    var storage = window.localStorage;
    var key = 'lexeme.' + lexeme.sp;
    if (storage[key] !== undefined) {
        console.warn('An existing lexeme was overwritten.');
    } else {
        console.info('A new lexeme was saved.');
    }
    var value = JSON.stringify(lexeme);
    storage[key] = value;
}

function loadLexeme(text) {

    console.info('loadLexeme() called.');

    // Load lexeme object
    var storage = window.localStorage;
    var lexeme = {};
    var key = 'lexeme.' + text;
    if (storage.keys(key) !== undefined) {
        lexeme = JSON.parse(storage[key]);
        console.info('Lexeme found in local storage: ' + text);
    } else {
        console.error('Lexeme not found in local storage: ' + text);
    }

    // Prepare a lexeme object



}

function saveTranslations() {

    console.info('saveTranslations() called.');
}

function loadTranslations() {

    console.info('loadTranslations() called.');
}

function saveInflections() {

    console.info('saveInflection() called.');
}

function loadInflection() {

    console.info('loadInflection() called.');
}

function saveForm() {

    console.info('saveForm() called.');

    saveLexeme();
    saveTranslations();
    saveInflections();

    window.lastHighlight.saved = true;
    window.unsavedChanges = false;
}

function resizeTranslationFieldset() {

    console.info('resizeTranslationFieldset() called.');

    // Controls
    var $fieldset = $('#add-translation');
    var $languageButton = $fieldset.find('button.translation-language').first();
    var $input = $fieldset.find('input').first();
    var $addButton = $fieldset.find('button.add').first();
    var $cancelButton = $fieldset.find('button.cancel').first();

    // Widths
    var totalWidth = parseInt($fieldset.css('width'));
    var languageButtonWidth = parseInt($languageButton.css('width'));
    var addButtonWidth = parseInt($addButton.css('width'));
    var cancelButtonWidth = parseInt($cancelButton.css('width'));

    // Input with calculation
    var inputWidth = totalWidth - languageButtonWidth - addButtonWidth - cancelButtonWidth - 20;
    $input.css('width', inputWidth);
}

$(window).on('resize', function() {
    var $translationFieldset = $('#add-translation');
    if ($translationFieldset.attr('data-select', true)) {
        resizeTranslationFieldset();
    }
});

function addTranslationHandler(event) {

    console.info('addTranslationHandler() called.');

    // Get properties for this call
    var $defaultButton = $(event.target);
    var $row = $defaultButton.parent();
    var $fieldset = $row.parent();

    // Replace the 'Add Translation' button with 'Add' and 'Cancel' buttons
    $defaultButton.disable();
    $defaultButton.removeAttr('data-select');
    $defaultButton.animate(
        { width: '33.3%' },
        { duration: DURATION_WIDTH, complete: function () {
            $defaultButton.fadeOut(DURATION_FADE, function () {
                var $languageButton = $fieldset.find('button.translation-language').first();
                var lastLanguage = window.lastLanguage[0];
                $languageButton.html(lastLanguage);
                $languageButton.fadeIn(DURATION_FADE, function () {
                    $languageButton.enable();
                }).css('display', 'table-cell');
                var $addButton = $fieldset.find('button.add').first();
                $addButton.fadeIn(DURATION_FADE, function () {
                    $addButton.enable();
                }).css('display', 'table-cell');
                var $cancelButton = $fieldset.find('button.cancel').first();
                $cancelButton.fadeIn(DURATION_FADE, function () {
                    $cancelButton.enable();
                }).css('display', 'table-cell');
                var $input = $fieldset.find('input').first();
                resizeTranslationFieldset();
                $input.css('padding', '0px 5px');
                $input.css('margin', '0px 10px');
                $input.fadeIn(DURATION_FADE, function () {
                    $input.focus();
                }).css('display', 'table-cell');
            });
        }}
    );
}

function defaultButtonClickHandler(event) {

    console.info('defaultButtonClickHandler() called.');

    // Get properties for this call
    var $defaultButton = $(event.target);
    var $fieldset = $defaultButton.parents('fieldset');

    // Set 'data-select' attribute
    if ($defaultButton.hasAttribute('data-select')) {
        $defaultButton.removeAttr('data-select');
    }

    // Replace the 'Add Translation' button with 'Add' and 'Cancel' buttons
    $defaultButton.disable();
    $defaultButton.animate(
        { width: '33.3%' },
        { duration: DURATION_WIDTH, complete: function () {
            $defaultButton.fadeOut(DURATION_FADE, function () {
                var $addButton = $fieldset.find('button.add').first();
                $addButton.fadeIn(DURATION_FADE, function () {
                    $addButton.enable();
                });
                var $cancelButton = $fieldset.find('button.cancel').first();
                $cancelButton.fadeIn(DURATION_FADE, function () {
                    $cancelButton.enable();
                });
                var $input = $fieldset.find('input').first();
                $input.css('width', 'calc(66% - 10px)');
                $input.css('padding', '0px 10px');
                $input.css('margin', '0px 10px');
                $input.fadeIn(DURATION_FADE, function () {
                    $input.focus();
                });
            });
        }}
    );
}

function addOrCancelButtonClickHandler(event) {

    console.info('addOrCancelButtonClickHandler() called.');

    // Get properties for this call
    var $button = $(event.target);
    var $addButton = null;
    var $cancelButton = null;
    var saveInput = false;
    if ($button.text().toLowerCase() === 'add') {
        $addButton = $(event.target);
        $cancelButton = $addButton.next();
        saveInput = true;
    } else {
        $cancelButton = $(event.target);
        $addButton = $cancelButton.prev();
    }
    var $fieldset = $addButton.parents('fieldset');
    var $languageButton = $fieldset.find('button.translation-language').first();

    $addButton.disable();
    $cancelButton.disable();
    $languageButton.disable();
    $addButton.fadeOut(DURATION_FADE);
    $cancelButton.fadeOut(DURATION_FADE);
    $languageButton.fadeOut(DURATION_FADE);
    var $input = $fieldset.find('input').first();
    $input.fadeOut(DURATION_FADE, function () {
        $input.css('width', '0%');
        $input.css('padding', '0px');
        $input.css('margin-right', '0px');
        var $defaultButton = $fieldset.find('button.default').first();
        $defaultButton.removeAttr('data-select');
        $defaultButton.fadeIn(DURATION_FADE, function () {
            $defaultButton.animate(
                { width: '100%' },
                { duration: DURATION_WIDTH, complete: function () {
                    $defaultButton.enable();
                    if (saveInput) {
                        var language = $languageButton.text();
                        var text = $input.val();
                        var div = $('#translations');
                        if (div.css('display') === 'none') {
                            div.css('display', 'block');
                        }
                        addTranslation(language, text);
                    }
                    $input.val('');
                }}
            );
        });
    });
}

function addTranslation(language, text) {

    console.info('addTranslation() called.');

    // Update lastLanguage global
    var index = window.lastLanguage.indexOf(language);
    window.lastLanguage.splice(index, 1);
    window.lastLanguage.unshift(language);

    // Make sure we got some text
    text = text.trim();
    if (text.length === 0) {
        return;
    }

    // Get the translation table
    var div = $('#translations');
    var $table = div.find('table').first();
    var $matchingRow = null;

    // Try find an existing row with this language
    $table.find('tr').each(function (index, element) {
        var $row = $(element);
        if ($row.find('>:first-child').text() === language) {
            $matchingRow = $row;
            return;
        }
    });

    // If no row with the given language was found, add a new row
    var $row = null;
    if ($matchingRow === null) {
        $row = $('<tr/>');
        $table.append($row);
        var $firstCell = $('<td>' + language + '</td>');
        $row.append($firstCell);
        var $lastCell = $('<td><span class="translation">' + text + '</span></td>');
        $row.append($lastCell);
    } else {
        // If a matching row was found, append text to the last cell
        var $lastCell = $matchingRow.find('>:last-child');
        var content = $lastCell.html() + ', <span class="translation">' + text + '</span>';
        $lastCell.html(content);
    }
}

function translationLanguageButtonClickHandler(event) {

    console.info('translationLanguageButtonClickHandler() called.');

    var $fieldset = $('#add-translation');
    var $button = $fieldset.find('button.translation-language').first();
    var $input = $fieldset.find('input').first();
    var buttonText = $button.text()
    var currentIndex = window.lastLanguage.indexOf(buttonText);
    if (currentIndex < window.lastLanguage.length - 1) {
        $button.text(window.lastLanguage[++currentIndex]);
    } else {
        $button.text(window.lastLanguage[0]);
    }
    $input.focus();
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
                    $button.addClass(lexicalCategory.name + '-unselected');
                    $button.attr('data-gr-id', grammeme.id);
                    $button.text(grammeme.name);
                    $div.append($button);
                    // TODO: Dividing buttons on multiple rows not implemented.
                });
            } else {
                $fieldset.attr('data-type', 'multi-select');
                $button = $('<button type="button" />');
                $button.addClass(lexicalCategory.name + '-unselected');
                $button.text(grammaticalCategory.name);
                $div.append($button);
            }

            // Append new fieldset to <div id="fieldsets">
            div.append($fieldset);
        });
    });
}

function adaptToLanguage(languageCode) {

    console.info('adaptToLanguage() called.');

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

function rootButtonClickHandler(event) {

    console.info('rootButtonClickHandler() called.');

    // Get current lexical category
    var lexicalCategoryId = getLexicalCategoryId();

    // Show grammatical categories
    $('div[data-lc-id="' + lexicalCategoryId + '"]').slideDown(DURATION_SLIDE);
}

function getLexicalCategoryId() {

    console.info('inflectionButtonClickHandler() called.');

    var $fieldset = $('#lexical-category');
    var $collection = $fieldset.find('button[data-selected]');
    if ($collection.length === 0) {
        return null;
    }
    var $button = $collection.first();
    var id = $button.attr('data-lc-id');
    return id;
}

function inflectionButtonClickHandler(event) {

    console.info('inflectionButtonClickHandler() called.');
}

$(document).ready(function () {

    console.info("$(document).ready() called!");

    // Load languages-specific buttons from Local Storage or AJAX
    var languageCode = $('article').attr('lang');
    adaptToLanguage(languageCode);

    // Handle selections in the <article> element
    $('article').on('mouseup', selectionHandler);

    // Handle focus/focusout on IPA
    $('#ipa').on({
        focus: ipaFocusHandler,
        focusout: ipaFocusOutHandler
    });

    $('#word', '#ipa').on('change', function () {
        window.unsavedChanges = true;
    });

    // Button handlers
    $('#lexical-category').on('click', 'button', lexicalCategoryHandler);
    $('form').on('click', 'fieldset[data-type="single-select"] button', singleSelectClickHandler);
    $('form').on('click', 'fieldset[data-type="multi-select"] button', multiSelectClickHandler);
    $('#add-translation').on('click', 'button.default', addTranslationHandler);
    $('#is-root').on('click', 'button[data-root="true"]', rootButtonClickHandler);
    $('#is-root').on('click', 'button[data-root="false"]', inflectionButtonClickHandler);
    $('form').on('click', 'button.add', addOrCancelButtonClickHandler);
    $('form').on('click', 'button.cancel', addOrCancelButtonClickHandler);
    $('form').on('click', 'button.translation-language', translationLanguageButtonClickHandler);
    $('#save').on('click', saveForm);

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
