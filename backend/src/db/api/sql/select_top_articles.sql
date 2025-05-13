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
    id IN (
        SELECT
            MAX(id)
        FROM
            articles
        GROUP BY
            category
    );