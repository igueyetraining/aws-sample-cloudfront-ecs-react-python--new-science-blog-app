INSERT INTO
    articles (
        title,
        date,
        author,
        text,
        agency,
        category,
        user_submitted
    )
VALUES
    (%s, %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY
UPDATE
    title = VALUES(title),
    date = VALUES(date),
    author = VALUES(author),
    text = VALUES(text),
    agency = VALUES(agency),
    category = VALUES(category),
    user_submitted = VALUES(user_submitted);