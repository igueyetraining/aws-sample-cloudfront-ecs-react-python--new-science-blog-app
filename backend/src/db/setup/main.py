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

from datetime import datetime, timedelta
import json
import logging
import os
from typing import Annotated, List
import mysql.connector
from mysql.connector import errorcode
from pydantic import BaseModel, Field
from ..common.connection import connect_to_mysql
from ..common.file import read_text_file
from ...types import Agency, Article, Author, Category, Text, Title

logger = logging.getLogger(__name__)

# In contrast to the API SQL statements which are reused constantly during the runtime of the
# application, the setup SQL statements are running once and therefore do not need to be kept
# in memory
SQL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sql")


class ArticlePrefillData(BaseModel):
    """
    Article data as in prefill_articles.json

    Attributes:
        title (str): The title of the article.
        author (str): The author of the article.
        text (str): The text content of the article.
        agency (str): The agency associated with the article.
        category (str): The category of the article.
        timedelta (int): number of days to subtract from current date.

    """

    title: Title
    author: Author
    text: Text
    agency: Agency
    category: Category
    timedelta: Annotated[int, Field(strict=True, ge=3, le=15)]


def create_tables() -> None:
    """
    Creates the 'categories' and 'articles' tables in the MySQL database.
    """
    cnx = connect_to_mysql(attempts=3)
    create_table_statements = {
        "categores": read_text_file(
            path=os.path.join(SQL_PATH, "create_table_categories.sql")
        ),
        "articles": read_text_file(
            path=os.path.join(SQL_PATH, "create_table_articles.sql")
        ),
    }
    with cnx.cursor() as cursor:
        for name, description in create_table_statements.items():
            try:
                print(f"Creating table {name}: ", end="")
                cursor.execute(description)
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")


def upsert_categories() -> None:
    """
    Inserts or updates a predefined set of categories in the 'categories' table.
    """
    cnx = connect_to_mysql(attempts=3)
    categories: List[Category] = [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Medicine",
        "Biology",
        "IT",
    ]
    sql = read_text_file(path=os.path.join(SQL_PATH, "upsert_category.sql"))
    for category in categories:
        with cnx.cursor() as cursor:
            cursor.execute(
                sql,
                (category,),
            )
            cnx.commit()


def get_prefill_articles() -> List[Article]:
    """
    Reads and parses article data from the prefill_articles.json file to create Article objects.

    This function:
    1. Locates and reads the prefill_articles.json file from the same directory as the source file
    2. Parses the JSON data into ArticlePrefillData objects
    3. Converts the ArticlePrefillData objects into Article objects, calculating dates based on
       the timedelta values

    Returns:
        List[Article]: A list of Article objects created from the prefill data
    """

    file_text = read_text_file(
        path=os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "prefill_articles.json"
        )
    )
    articles_data = json.loads(file_text)

    articles: List[Article] = []
    for article_data in articles_data:
        try:
            articles.append(
                Article(
                    title=article_data["title"],
                    date=datetime.today() - timedelta(days=article_data["timedelta"]),
                    author=article_data["author"],
                    text=article_data["text"],
                    agency=article_data["agency"],
                    category=article_data["category"],
                    user_submitted=0,
                )
            )
        except Exception as e:
            logger.exception(
                "Invalid article data '%s': %s", json.dumps(article_data), str(e)
            )
            raise

    return articles


def prefill_articles() -> None:
    """
    Prefills the database with a set of predefined articles.

    This function inserts a list of predefined Article objects into the database table 'articles'.
    If the table is empty, it inserts all the articles. If the table already contains articles,
    it updates the existing articles with the new data.
    """
    cnx = connect_to_mysql(attempts=3)
    select_count_articles_sql = read_text_file(
        path=os.path.join(SQL_PATH, "select_count_articles.sql")
    )
    insert_article_sql = read_text_file(
        path=os.path.join(SQL_PATH, "insert_article.sql")
    )

    with cnx.cursor() as cursor:
        # get number of rows in articles table, store in variable
        cursor.execute(select_count_articles_sql)
        num_rows: int = cursor.fetchone()[0]

        if num_rows == 0:
            for article in get_prefill_articles():
                cursor.execute(
                    insert_article_sql,
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


def init_db() -> None:
    """
    Initializes the database by creating tables, upserting categories, and prefilling articles.

    Raises:
        Exception: If the connection to the database cannot be established.
    """
    cnx = connect_to_mysql(attempts=3)
    if cnx and cnx.is_connected():
        create_tables()
        upsert_categories()
        prefill_articles()
    else:
        raise RuntimeError("Could not connect to database")
