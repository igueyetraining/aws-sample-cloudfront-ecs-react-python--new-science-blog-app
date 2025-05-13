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

---

This module contains the FastAPI application for a news article management system.
"""

import logging
import os
import sys
from typing import Dict, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .db.api.main import (
    get_top_articles,
    get_category_articles,
    add_article,
)
from .db.setup.main import (
    init_db,
)
from .types import Article, Category, GetCategoryArticlesResult, HealthCheck

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=os.environ["ORIGIN_REGEX"],
    allow_methods=["OPTIONS", "GET", "POST"],
    allow_headers=[
        "*",
    ],
)


@app.get("/top-stories")
def get_top_stories() -> List[Article]:
    """
    Retrieves the top articles from the database.

    Returns:
        List[Article]: A list of Article objects representing the top articles.
    """
    try:
        top_stories = get_top_articles()
        return top_stories
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Server Error") from e


@app.get("/category/{category}/{page}")
def get_category_stories(category: Category, page: int) -> GetCategoryArticlesResult:
    """
    Retrieves articles from the database for a given category.

    Args:
        category (str): The category of articles to retrieve.

    Returns:
        GetCategoryArticlesResult: A list of Article objects for the specified category
            and the total number of article pages in this category.
    """
    try:
        category_articles_result = get_category_articles(category, page)
        return category_articles_result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Server Error") from e


@app.post("/article")
def post_article(article: Article) -> Dict[str, str]:
    """
    Adds a new article to the database.

    Args:
        article (Article): The Article object to be added to the database.

    Returns:
        Dict[str, str]: A dictionary with a success message.
    """
    try:
        add_article(article)
        return {"message": "Article added successfully"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal Server Error") from e


@app.get(
    "/health",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
def get_health() -> HealthCheck:
    """
    ## Perform a Health Check
    Endpoint to perform a healthcheck on. This endpoint can primarily be used Docker
    to ensure a robust container orchestration and management is in place. Other
    services which rely on proper functioning of the API service will not deploy if this
    endpoint returns any other HTTP status code except 200 (OK).
    Returns:
        HealthCheck: Returns a JSON response with the health status
    """
    return HealthCheck(status="OK")
