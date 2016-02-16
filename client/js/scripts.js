'use strict';

function isValidLetter(letter) {
    letter = letter.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (letter !== '') ? true : false;
}

function fieldsetClickHandler(id, columns) {
    $(id + ' button').click(function (event) {
        var $fieldset = $(id);
        var $cell = $(this);
        var $row = $cell.parent();
        var $siblingRows = $row.siblings();
        var $siblingCells = $cell.siblings();
        if ($fieldset.data('selected') === 'no') {
            $fieldset.data('selected', 'yes');
            $cell.css('border-width', '0px');
            $(function () {
                $siblingRows.animate(
                    { height: '0px' },
                    { duration: 200, queue: false }
                );
                $cell.animate(
                    { width: '100%' },
                    { duration: 200, queue: false, complete: function () {
                        $cell.css('border-width', '2px 0px');
                    }}
                );
                $siblingCells.animate(
                    { width: '0%' },
                    { duration: 200, queue: false, complete: function () {
                        $siblingCells.css('border-width', '2px 0px');
                    }}
                );
            });
        } else {
            $fieldset.data('selected', 'no');
            $(function () {
                $siblingRows.animate(
                    { height: '60px' },
                    { duration: 200, queue: false }
                );
                $cell.animate(
                    { width: (100 / columns) + '%' },
                    { duration: 200, queue: false, complete: function () {
                        $cell.css('border-width', '2px 2px');
                    }}
                );
                $siblingCells.animate(
                    { width: (100 / columns) + '%' },
                    { duration: 200, queue: false, complete: function () {
                        $siblingCells.css('border-width', '2px 2px');
                    }}
                );
            });
        }
    });
}

$(document).ready(function () {

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

    // Border defaults
    $('#lexicalCategory button').css('border-width', '2px');
    $('#gender button').css('border-width', '2px');
    $('#number button').css('border-width', '2px');
    $('#countableUncountable button').css('border-width', '2px');
    $('#concreteAbstract button').css('border-width', '2px');
    $('#commonProper button').css('border-width', '2px');

    // Fieldset click-handlers
    fieldsetClickHandler('#lexicalCategory', 3);
    fieldsetClickHandler('#gender', 3);
    fieldsetClickHandler('#number', 2);
    fieldsetClickHandler('#countableUncountable', 2);
    fieldsetClickHandler('#concreteAbstract', 2);
    fieldsetClickHandler('#commonProper', 2);

    $('article').click(function (event) {
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
                $('#word').val(word);
            }
        }
    });
});
