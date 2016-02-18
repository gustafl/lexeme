CREATE PROCEDURE select_grammatical_categories(
	param1 varchar(5),
	param2 tinyint(3)
)
BEGIN

SELECT A.id AS grammatical_category_id,
       A.name AS grammatical_category_name,
       B.id AS grammeme_id,
       B.name AS grammeme_name
FROM grammeme AS B
LEFT JOIN grammatical_category AS A
    ON A.id = B.grammatical_category
LEFT JOIN language_grammeme AS C
    ON C.grammeme = B.id
LEFT JOIN language AS D
    ON D.id = C.language
WHERE D.code = param1 AND
      A.lexical_category = param2

UNION

SELECT A.id AS grammatical_category_id,
       A.name AS grammatical_category_name,
       B.id AS grammeme_id,
       B.name AS grammeme_name
FROM grammatical_category AS A
LEFT JOIN grammeme AS B
    ON B.grammatical_category = A.id
LEFT JOIN language_grammatical_category AS C
    ON C.grammatical_category = A.id
LEFT JOIN language AS D
    ON D.id = C.language
WHERE D.code = param1 AND
      A.lexical_category = param2 AND
      B.grammatical_category IS NULL;

END
