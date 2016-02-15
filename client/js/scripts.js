'use strict';

function isValidLetter(letter) {
    letter = letter.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
    return (letter !== '') ? true : false;
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
