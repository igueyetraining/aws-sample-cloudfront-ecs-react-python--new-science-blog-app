SELECT
    title,
    date,
    author,
    text,
    agency,
    category,
    user_submitted
FROM
    articles
WHERE
    category = %s
ORDER BY
    date DESC
LIMIT
    %s OFFSET %s;