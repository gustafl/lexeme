'use strict';

function isValidLetter(letter) {
    letter = letter.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (letter !== '') ? true : false;
}

function getNumberOfColumns(numberOfGrammemes) {

    console.info("getNumberOfColumns(%d) called.", numberOfGrammemes);

    switch (numberOfGrammemes) {
        case 0:
        case 1:
            return 1;
        case 2:
            return 2;
        default:
            return 3;
    }
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

function handleGrammaticalCategory(data) {

    console.info("handleGrammaticalCategory() called.");

    $.each(data, function(key, val) {
        var columns = getNumberOfColumns(val.grammemes.length);
        var html = '\n<fieldset class="col-' + columns + '" data-selected="no"><div>';
        if (val.grammemes.length > 0) {
            // TODO: Add code to divide buttons on rows here, if there are > 3.
            $.each(val.grammemes, function(key, val) {
                html += '<button type="button" class="' + val.name + '" value="' + val.id + '">' + val.name + '</button>';
            });
        } else {
            html += '<button type="button" class="' + val.name + '" value="' + val.id + '">' + val.name + '</button>';
        }
        html += '</div></fieldset>\n';
        $('#fieldsets').append(html);
    });
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

function toggleButtons(event) {

    // Get properties if this call
    var $cell = $(event.toElement);
    var $fieldset = $cell.parent().parent();
    var $row = $cell.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();
    var duration = 400;

    // If data is not selected
    if ($fieldset.attr('data-selected') === 'no') {
        $fieldset.attr('data-selected', 'yes');
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
function lexicalCategoryButtonClickHandler(event) {

    // Get properties if this call
    var $cell = $(event.toElement);
    var $fieldset = $cell.parent().parent();

    // If a lexical category has been selected.
    if ($fieldset.attr('data-selected') === 'yes') {
        // Remove all lexical category specific fieldsets.
        $('#fieldsets').hide();
    } else {
        var settings = {
            dataType: 'json',
            url: 'http://localhost:3000/api/grammatical_category',
            data: {
                lexical_category: $cell.val(),
                language: $('article').attr('lang')
            },
            success: function (data) {
                handleGrammaticalCategory(data);
                /*$('#fieldsets fieldset').each(function () {
                    var $fieldset = $(this);
                    var duration = 250;
                    $(function () {
                        $fieldset.find('div').animate(
                            { height: '60px', marginBottom: '20px' },
                            { duration: duration, queue: true }
                        );
                    });
                });*/
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
    $('#lexical-category').on('click', 'button', null, lexicalCategoryButtonClickHandler);
    $('fieldset').on('click', 'button', null, toggleButtons);

});

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
