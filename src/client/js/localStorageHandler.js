'use strict';

/**
 * Handles saves to and loads from Local Storage.
 */
var LocalStorageHandler = function() {

    const LETTER = 'a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF';
    const LEXEME_KEY = 'lexeme\.[a-z]{2}\.[LETTER]+\.[0-9][1-9]';

    var saveLexeme = function (language, lexicalCategoryId, spelling, pronounciation) {

        // Prepare a lexeme object
        var lexeme = {};

        // Add basic lexeme data
        lexeme.la = language;
        lexeme.lcid = lexicalCategoryId;
        lexeme.sp = spelling;
        lexeme.pr = pronounciation;
        lexeme.gc = [];

        // Store lexeme object
        var storage = window.localStorage;
        var key = 'lexeme.' + lexeme.sp;
        if (storage[key] !== undefined) {
            console.warn('An existing lexeme was overwritten: ' + spelling);
        } else {
            console.info('A new lexeme was saved: ' + spelling);
        }
        var value = JSON.stringify(lexeme);
        storage[key] = value;
    };

    var loadLexeme = function (key) {

    };

    var loadLexemes = function (language, spelling) {

        // Load lexeme object
        var storage = window.localStorage;
        var key = 'lexeme.' + spelling;
        if (storage[key] !== undefined) {
            console.warn('Lexeme not found: ' + spelling);
            return;
        }
        var lexeme = JSON.parse(lexeme);
    };

    return {
        saveLexeme: saveLexeme
    };
};
