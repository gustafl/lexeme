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

    function initialize() {

        // Top section
        $('#word').val('Click on a word');
        $('#ipa').hide();

        // Add brackets to IPA
        var text = $('#ipa').val();
        text = '[' + text + ']';
        $('#ipa').val(text);

        // Border defaults
        $('.col-1 button').css('border-width', '2px');
        $('.col-2 button').css('border-width', '2px');
        $('.col-3 button').css('border-width', '2px');

        // Hide the lexical category selector
        $('#lexical-categories').hide();

        // Hide the translation button
        $('#translation').hide();
    }

    initialize();

    function compareGrammaticalCategoryIds(object1, object2) {
        if (object1.grammatical_category < object2.grammatical_category) {
            return -1;
        } else if (object1.grammatical_category > object2.grammatical_category) {
            return 1;
        } else {
            return 0;
        }
    }

    function compareGrammemeIds(object1, object2) {
        if (object1.id < object2.id) {
            return -1;
        } else if (object1.id > object2.id) {
            return 1;
        } else {
            return 0;
        }
    }

    $('#lexical-categories button').click(function () {

        // Prevent AJAX request if we're resetting the lexical category selection.
        if ($('#lexical-categories').data('selected') === 'yes') {
            return;
        }

        var settings = {
            dataType: 'json',
            url: 'http://localhost:3000/api/grammatical_category',
            data: {
                lexical_category: $(this).val(),
                language: $('article').attr('lang'),
                format: 'json'
            },
            success: function (data) {
                handleGrammaticalCategory(data);
            }
        };
        $.get(settings);
    });

    function handleGrammaticalCategory(data) {
        //console.log(data);
        $.each(data, function(key, val) {
            //console.log(val);
            var settings = {
                dataType: 'json',
                url: 'http://localhost:3000/api/grammeme',
                data: {
                    grammatical_category: key,
                    language: $('article').attr('lang'),
                    format: 'json'
                },
                success: function (data) {
                    handleGrammene(data);
                }
            };
            $.get(settings);
        });
    }

    function handleGrammene(data) {
        //console.log(data);

        // NOTE: So far so good. We are getting some empty arrays back, but that is for
        // collective and mass nouns, which don't have any grammemes. Remember to catch
        // any categories that don't have grammemes, so we can make checkboxes for them.

        $.each(data, function(key, val) {
            console.log(val);
        });
    }

    function drawForm(array) {

        array.sort(compareGrammaticalCategoryIds);
        array.sort(compareGrammemeIds);

        var html;
        // Version 1.0 (put all buttons on a single row)
        // Get array of unique grammatical categories in original array
        var uniqueGrammaticalCategoryIds = _.uniqBy(array, 'grammatical_category');

        // For each unique grammatical category
        for (var id in uniqueGrammaticalCategoryIds) {
            // Get all grammeme objects with this grammatical category
            var matchingGrammemes = array.filter(function (element, index, array) {
                if (element.grammatical_category === id) {
                    return true;
                }
            });
            // Write <fieldset><div>, using number of matching grammemes
            html += '<fieldset class="col-' + matchingGrammemes.length + '" data-selected="no">\n              <div>';
            // For each matching grammeme
            for (var grammeme in matchingGrammemes) {
                // Write <button>, using the grammeme name
                html += '<button type="button" class="' + grammeme.name.toLowerCase() + '">' + grammeme.name.toLowerCase() + '</button>';
            }
        }
        // Write </div></fieldset>
        html += '\n              </div>\n            </fieldset>\n';
    }

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

    // Fieldset click-handlers
    fieldsetClickHandler('.col-1', 1);
    fieldsetClickHandler('.col-2', 2);
    fieldsetClickHandler('.col-3', 3);

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
                $(function () {
                    $('fieldset.header').animate(
                        { height: '165px' },
                        { duration: 250, queue: false, complete: function () {
                            $('#ipa').show();
                            $('#ipa').val('[...]');
                        }}
                    );
                    $('#lexical-categories').slideDown();
                    $('#translation').slideDown();
                });
            }
        }
    });
});
