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

$(document).ready(function () {

    console.info("$(document).ready() called.");

    // Prompt user to click on a word
    $('#word').val('Click on a word');

    // Handle clicks within the <article> element
    $('article').click(function (event) {

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
    });

    // Handle focus/blur on IPA
    $('#ipa').focus(function () {
        var text = $('#ipa').val();
        text = text.replace(/[\[\]]/g, '');
        $('#ipa').val(text);
    });
    $('#ipa').focusout(function () {
        var text = $('#ipa').val();
        text = '[' + text + ']';
        $('#ipa').val(text);
    });

    // Handle any button clicks in form
    $('.col-1 button, .col-2 button, .col-3 button').click(function (event) {

        // Get properties if this call
        var $cell = $(this);
        var $fieldset = $cell.parent().parent();

        if ($fieldset.attr('id') === 'lexical-category') {
            // If a lexical category has been selected.
            if ($fieldset.attr('data-selected') === 'yes') {
                // Remove all lexical category specific fieldsets.
                $('#fieldsets').hide();
                toggleButtons($(this));
                $fieldset.attr('data-selected', 'no');
                return;
            // If a lexical category has not been selected, but buttons have been loaded before.
            } else if ($('#fieldsets').children().length > 0) {
                // Show buttons again.
                $('#fieldsets').show();
                toggleButtons($(this));
                $fieldset.attr('data-selected', 'yes');
                return;
            // If this is the first time a lexical category is selected.
            } else {
                var settings = {
                    dataType: 'json',
                    url: 'http://localhost:3000/api/grammatical_category',
                    data: {
                        lexical_category: $(this).val(),
                        language: $('article').attr('lang')
                    },
                    success: function (data) {
                        handleGrammaticalCategory(data);
                        $('#fieldsets fieldset').each(function () {
                            var $fieldset = $(this);
                            var duration = 250;
                            $(function () {
                                $fieldset.find('div').animate(
                                    { height: '60px', marginBottom: '20px' },
                                    { duration: duration, queue: true }
                                );
                            });
                        });
                    }
                };
                $.get(settings);
            }
        }
        toggleButtons($(this));
        $fieldset.attr('data-selected', 'yes');
    });

});

function toggleButtons($button) {

    var $cell = $button;
    var $fieldset = $cell.parent().parent();
    var $row = $cell.parent();
    var $siblingRows = $row.siblings();
    var $siblingCells = $cell.siblings();
    var duration = 400;

    if ($fieldset.attr('data-selected') === 'no') {
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
        $(function () {
            $siblingRows.animate(
                { height: '60px' },
                { duration: duration, queue: false }
            );
            $cell.animate(
                { width: (100 / $siblingCells.length) + '%' },
                { duration: duration, queue: false }
            );
            $siblingCells.animate(
                { width: (100 / $siblingCells.length) + '%' },
                { duration: duration, queue: false }
            );
        });
    }
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
