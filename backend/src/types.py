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

from datetime import datetime
from typing import Annotated, List, Literal
from pydantic import BaseModel, Field, StringConstraints

Agency = Annotated[str, StringConstraints(min_length=1, max_length=50)]
Author = Annotated[str, StringConstraints(min_length=1, max_length=50)]
Category = Literal["Mathematics", "Physics", "Chemistry", "Medicine", "Biology", "IT"]
Text = Annotated[str, StringConstraints(min_length=1, max_length=2000)]
Title = Annotated[str, StringConstraints(min_length=1, max_length=100)]
UserSubmitted = Annotated[int, Field(strict=True, ge=0, le=1)]


class Article(BaseModel):
    """
    A class representing an article.

    Attributes:
        title (str): The title of the article.
        date (datetime): The date of the article.
        author (str): The author of the article.
        text (str): The text content of the article.
        agency (str): The agency associated with the article.
        category (str): The category of the article.
        user_submitted (int): Whether the article was submitted by a user rather than
            prefilled by us.
    """

    title: Title
    date: datetime
    author: Author
    text: Text
    agency: Agency
    category: Category
    user_submitted: UserSubmitted


class GetCategoryArticlesResult(BaseModel):
    """
    A class representing the result of the get_category_article function.

    Attributes:
        articles (List[Article]): The list of articles returned.
        total_pages (int): The maximum number of pages for this category.
    """

    articles: List[Article]
    total_pages: int


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""

    status: str = "OK"
