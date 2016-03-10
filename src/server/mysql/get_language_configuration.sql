CREATE PROCEDURE select_grammatical_categories(
    param1 varchar(5)
)
BEGIN

SELECT lexical_category.id AS lc_id,
    lexical_category.name AS lc_name,
    grammatical_category.id AS gc_id,
    grammatical_category.name AS gc_name,
    CAST(grammatical_category.subgroup AS UNSIGNED INTEGER) AS gc_subgroup,
    grammeme.id AS gr_id,
    grammeme.name AS gr_name
FROM grammeme
LEFT JOIN grammatical_category
    ON grammatical_category.id = grammeme.grammatical_category
LEFT JOIN lexical_category
    ON lexical_category.id = grammatical_category.lexical_category
LEFT JOIN language_grammeme
    ON language_grammeme.grammeme = grammeme.id
LEFT JOIN language
    ON language.id = language_grammeme.language
WHERE language.code = param1

UNION

SELECT lexical_category.id AS lc_id,
    lexical_category.name AS lc_name,
    grammatical_category.id AS gc_id,
    grammatical_category.name AS gc_name,
    CAST(grammatical_category.subgroup AS UNSIGNED INTEGER) AS gc_subgroup,
    grammeme.id AS gr_id,
    grammeme.name AS gr_name
FROM grammatical_category
LEFT JOIN grammeme
    ON grammeme.grammatical_category = grammatical_category.id
LEFT JOIN lexical_category
    ON lexical_category.id = grammatical_category.lexical_category
LEFT JOIN language_grammatical_category
    ON language_grammatical_category.grammatical_category = grammatical_category.id
LEFT JOIN language
    ON language.id = language_grammatical_category.language
WHERE language.code = param1 AND grammeme.grammatical_category IS NULL;

END
