'use strict';

/**
 * The AutoHighlighter is used to wrap all instances of a given search string
 * (within the <article> element) in <span> elements. Zero or more classes may
 * be added to the <span> element.
 */
var AutoHighlighter = function() {

    /**
     * The highlighter is currently hard-coded to wrap the search string in a
     * <span> element, but this may become a parameter in a future version.
     * @type {String}
     */
    var elementType = 'SPAN';

    /**
     * The element returned from the querySelector is fed into the TreeWalker.
     * We're only concerned with text in the <article> element.
     * @type {Element}
     */
    var root = document.querySelector('article');

    /**
     * This variable goes into the TreeWalker. We are filtering out everything
     * besides element and text nodes. We need the element nodes to be able to
     * check for existing <span> elements (to skip over them). Note that this
     * filtering is done before the filter expressed in the variable below.
     * @type {NodeFilter}
     */
    var whatToShow = NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT;

    /**
     * Filters out whitespace-only text nodes and existing <span> elements.
     * @type {NodeFilter}
     */
    var filter = {
        acceptNode: function (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nodeValue.trim() === '') {
                    return NodeFilter.FILTER_REJECT;
                }
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.nodeName === elementType) {
                    return NodeFilter.FILTER_REJECT;
                }
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }

    /**
     * Checks if a given character is a valid letter (in the range 00-FF).
     * @param  {String}  character The character to test.
     * @return {Boolean}           True if the character is a valid letter.
     */
    var isValidLetter = function (character) {
        character = character.replace(/[^a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, '');
        return (character !== '') ? true : false;
    };

    /**
     * Highlights all instances of a given search string in <span> elements.
     * @param  {String} searchString The string to look for.
     * @param  {Array}  classNames   An array of class names.
     */
    var highlight = function (searchString, classNames) {
        // TODO: Check that classNames is an array
        var walker = document.createTreeWalker(root, whatToShow, filter);
        var node = root;
        while (node = walker.nextNode()) {
            // Skip everything but text nodes
            if (node.nodeType !== Node.TEXT_NODE) {
                continue;
            }
            var index = 0;
            // Loop through matches in text node
            while ((index = node.nodeValue.indexOf(searchString, index)) > -1) {
                // Make sure characters left and right of match are not valid letters
                var previousCharacter = (index > 0) ? node.nodeValue.substr(index - 1, 1) : null;
                if (previousCharacter !== null && isValidLetter(previousCharacter)) {
                    index += searchString.length;
                    continue;
                }
                var nextCharacter = (index < node.nodeValue.length - 1) ? node.nodeValue.substr(index + searchString.length, 1) : null;
                if (nextCharacter !== null && isValidLetter(nextCharacter)) {
                    index += searchString.length;
                    continue;
                }
                // Create new <span> element
                var element = document.createElement(elementType.toLowerCase());
                var text = document.createTextNode(searchString);
                element.appendChild(text);
                for (var className of classNames) {
                    element.classList.add(className);
                }
                // Insert <span> in text node
                var parent = node.parentNode;
                var middle = node.splitText(index);
                index = 0;
                var end = middle.splitText(searchString.length);
                parent.replaceChild(element, middle);
                walker.nextSibling();
                node = walker.currentNode;
                parent.normalize();
            }
        }
    };

    return {
        highlight: highlight
    };
};
