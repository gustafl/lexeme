USE `lexeme`;

/* Lexical categories */
INSERT INTO `lexical_category` (`name`) VALUES ('noun');
INSERT INTO `lexical_category` (`name`) VALUES ('pronoun');
INSERT INTO `lexical_category` (`name`) VALUES ('adjective');
INSERT INTO `lexical_category` (`name`) VALUES ('determiner');
INSERT INTO `lexical_category` (`name`) VALUES ('verb');
INSERT INTO `lexical_category` (`name`) VALUES ('adverb');
INSERT INTO `lexical_category` (`name`) VALUES ('preposition');
INSERT INTO `lexical_category` (`name`) VALUES ('conjunction');
INSERT INTO `lexical_category` (`name`) VALUES ('interjection');

/* Languages */
INSERT INTO `language` (`name`, `code`) VALUES ('English', 'en');
INSERT INTO `language` (`name`, `code`) VALUES ('French', 'fr');
INSERT INTO `language` (`name`, `code`) VALUES ('Swedish', 'sv');

/* Grammatical categories */
INSERT INTO `grammatical_category` (`name`) VALUES ('Gender');
INSERT INTO `grammatical_category` (`name`) VALUES ('Number');
INSERT INTO `grammatical_category` (`name`) VALUES ('Case');
INSERT INTO `grammatical_category` (`name`) VALUES ('Proper/Common');
INSERT INTO `grammatical_category` (`name`) VALUES ('Abstract/Concrete');
INSERT INTO `grammatical_category` (`name`) VALUES ('Countable/Uncountable');
INSERT INTO `grammatical_category` (`name`) VALUES ('Collective noun');
INSERT INTO `grammatical_category` (`name`) VALUES ('Mass noun');

/* Grammemes */
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (1, 'Masculine');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (1, 'Feminine');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (1, 'Neuter');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (1, 'Common');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (1, 'Dual');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (2, 'Singular');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (2, 'Plural');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Nominative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Accusative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Dative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Ablative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Genitive');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Vocative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Locative');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (3, 'Instrumental');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (4, 'Proper');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (4, 'Common');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (5, 'Abstract');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (5, 'Concrete');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (6, 'Countable');
INSERT INTO `grammeme` (`grammatical_category`, `name`) VALUES (6, 'Uncountable');

/* Grammatical categories in English */
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 1);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 2);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 3);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 4);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 5);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 6);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 7);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (1, 8);

/* Grammemes in English */
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 1);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 2);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 3);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 5);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 6);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 7);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 8);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 12);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 16);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 17);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 18);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 19);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 20);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (1, 21);

/* Grammatical categories in French */
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 1);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 2);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 4);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 5);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 6);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 7);
INSERT INTO `language_grammatical_category` (`language`, `grammatical_category`) VALUES (2, 8);

/* Grammemes in French */
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 1);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 2);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 6);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 7);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 16);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 17);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 18);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 19);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 20);
INSERT INTO `language_grammeme` (`language`, `grammeme`) VALUES (2, 21);
