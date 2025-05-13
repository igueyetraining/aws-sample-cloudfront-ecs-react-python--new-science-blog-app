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
    (%s, %s, %s, %s, %s, %s, %s);