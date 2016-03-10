'use strict';

QUnit.test('Count unique words', function(assert) {
    var firstSection = $('section')[0];
    var counter = new WordCounter('frequency');
    counter.count('section');
    var uniqueWords = counter.getWords();
    assert.equal(uniqueWords.length, 989, 'Counting the number of unique words in the first chapter.');
});
