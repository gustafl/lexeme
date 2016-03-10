USE `lexeme`;

INSERT INTO `grammatical_category`
VALUES
    (1,'gender',1,3),
    (2,'number',1,2),
    (3,'case',1,2),
    (4,NULL,1,1),
    (5,NULL,1,1),
    (6,NULL,1,1),
    (7,'collective noun',1,1),
    (8,'mass noun',1,1),
    (9,'tense',2,2),
    (10,'mood',2,2),
    (11,'voice',2,2);

INSERT INTO `grammeme`
VALUES
    (1,1,'masculine'),
    (2,1,'feminine'),
    (3,1,'neuter'),
    (4,1,'common'),
    (5,1,'dual'),
    (6,2,'singular'),
    (7,2,'plural'),
    (8,3,'nominative'),
    (9,3,'accusative'),
    (10,3,'dative'),
    (11,3,'ablative'),
    (12,3,'genitive'),
    (13,3,'vocative'),
    (14,3,'locative'),
    (15,3,'instrumental'),
    (16,4,'proper'),
    (17,4,'common'),
    (18,5,'abstract'),
    (19,5,'concrete'),
    (20,6,'countable'),
    (21,6,'uncountable'),
    (22,9,'present');

INSERT INTO `language`
VALUES
    (1,'english','en'),
    (2,'french','fr'),
    (3,'swedish','sv');

INSERT INTO `language_grammatical_category`
VALUES
    (1,1),
    (1,2),
    (1,3),
    (1,4),
    (1,5),
    (1,6),
    (1,7),
    (1,8),
    (2,1),
    (2,2),
    (2,4),
    (2,5),
    (2,6),
    (2,7),
    (2,8),
    (2,9),
    (2,10),
    (2,11);

INSERT INTO `language_grammeme`
VALUES
    (1,1),
    (1,2),
    (1,3),
    (1,5),
    (1,6),
    (1,7),
    (1,8),
    (1,12),
    (1,16),
    (1,17),
    (1,18),
    (1,19),
    (1,20),
    (1,21),
    (2,1),
    (2,2),
    (2,6),
    (2,7),
    (2,16),
    (2,17),
    (2,18),
    (2,19),
    (2,20),
    (2,21),
    (2,22);

INSERT INTO `lexical_category`
VALUES
    (1,'noun'),
    (2,'verb'),
    (3,'adjective'),
    (4,'pronoun'),
    (5,'adverb'),
    (6,'determiner'),
    (7,'preposition'),
    (8,'conjunction'),
    (9,'interjection');
