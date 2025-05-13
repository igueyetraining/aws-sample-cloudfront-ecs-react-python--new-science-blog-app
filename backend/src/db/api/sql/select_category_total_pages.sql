SELECT
    CEILING(COUNT(*) / %s)
FROM
    articles
WHERE
    category = %s;