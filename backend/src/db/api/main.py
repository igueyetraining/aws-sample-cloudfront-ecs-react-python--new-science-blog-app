"""
MIT No Attribution

Copyright 2025 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""

import os
from typing import Dict, List
from ..common.connection import connect_to_mysql
from ..common.file import read_text_file
from ...types import Article, Category, GetCategoryArticlesResult

PAGE_SIZE = 5

SQL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sql")
SQL_SELECT_TOP_ARTICLES = read_text_file(
    path=os.path.join(SQL_PATH, "select_top_articles.sql")
)
SQL_SELECT_CATEGORY_ARTICLES = read_text_file(
    path=os.path.join(SQL_PATH, "select_category_articles.sql")
)
SQL_SELECT_CATEGORY_TOTAL_PAGES = read_text_file(
    path=os.path.join(SQL_PATH, "select_category_total_pages.sql")
)
SQL_INSERT_ARTICLE = read_text_file(
    path=os.path.join(SQL_PATH, "insert_article.sql")
)


def get_top_articles() -> List[Article]:
    """
    Retrieves the most recent article for each category from the database.

    Returns:
        List[Article]: A list of Article objects representing the most recent article for each
            category.
    """
    cnx = connect_to_mysql(attempts=3)
    with cnx.cursor() as cursor:
        cursor.execute(SQL_SELECT_TOP_ARTICLES)
        articles = cursor.fetchall()
        return [
            Article(
                **{
                    "title": article[0],
                    "date": article[1],
                    "author": article[2],
                    "text": article[3],
                    "agency": article[4],
                    "category": article[5],
                    "user_submitted": article[6],
                }
            )
            for article in articles
        ]


def get_category_articles(category: Category, page: int) -> Dict:
    """
    Retrieves all articles for a given category from the database, ordered by date in descending
    order.

    Args:
        category (str): The category for which to retrieve articles.

    Returns:
       GetCategoryArticlesResult: The result including the list of articles as well as the total
            number of pages in this category
    """
    cnx = connect_to_mysql(attempts=3)

    articles_list: List[Article] = []
    total_pages = 0

    with cnx.cursor() as cursor:
        cursor.execute(
            SQL_SELECT_CATEGORY_ARTICLES, (category, PAGE_SIZE, (page - 1) * PAGE_SIZE)
        )
        query_result = cursor.fetchall()
        articles_list = [
            Article(
                **{
                    "title": article[0],
                    "date": article[1],
                    "author": article[2],
                    "text": article[3],
                    "agency": article[4],
                    "category": article[5],
                    "user_submitted": article[6],
                }
            )
            for article in query_result
        ]

    with cnx.cursor() as cursor:
        cursor.execute(
            SQL_SELECT_CATEGORY_TOTAL_PAGES,
            (
                PAGE_SIZE,
                category,
            ),
        )
        query_result = cursor.fetchone()
        total_pages = query_result[0]

    return GetCategoryArticlesResult(articles=articles_list, total_pages=total_pages)


def add_article(article: Article) -> None:
    """
    Adds a new article to the database.

    Args:
        article (Article): The Article object representing the new article to be added.
    """
    cnx = connect_to_mysql(attempts=3)
    with cnx.cursor() as cursor:
        cursor.execute(
            SQL_INSERT_ARTICLE,
            (
                article.title,
                article.date,
                article.author,
                article.text,
                article.agency,
                article.category,
                article.user_submitted,
            ),
        )
        cnx.commit()
