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

import logging

logger = logging.getLogger(__name__)

def read_text_file(path: str, encoding: str = "utf-8") -> str:
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
    try:
        with open(file=path, mode="r", encoding=encoding) as file:
            return file.read()
    except Exception as e:
        logger.exception("Could not read prefill_articles.json: %s", str(e))
        raise
