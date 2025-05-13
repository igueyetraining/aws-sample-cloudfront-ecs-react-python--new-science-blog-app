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

Due to the asynchronous operation of FastAPI, each function connects to the database 
individually instead of sharing a connection object.
Otherwise errors as in 
https://stackoverflow.com/questions/65169638/mysqlconnector-python-new-db-connection-for-each-query-vs-one-single-connect
"""

import os
import time
import mysql.connector
from mysql.connector import errorcode, MySQLConnection

def connect_to_mysql(attempts: int, delay: int = 2) -> MySQLConnection:
    """
    Attempts to establish a connection to a MySQL database.

    Args:
        attempts (int): The maximum number of attempts to make when connecting to the database.
        delay (int, optional): The initial delay in seconds between connection attempts.
            Defaults to 2.

    Returns:
        mysql.connector.connection: A connection object to the MySQL database.

    Raises:
        mysql.connector.Error: If the connection fails after all attempts.

    This function uses environment variables to retrieve the database credentials and connection
    details. It will attempt to connect to the database up to the specified number of attempts,
    with an exponential backoff delay between each attempt. If a connection cannot be established
    after all attempts, it will raise a mysql.connector.Error exception.
    """
    attempt = 1
    while attempt <= attempts:
        try:
            return mysql.connector.connect(
                user=os.environ["DB_USER"],
                password=os.environ["DB_USER_PASSWORD"],
                host=os.environ["DB_HOST"],
                database=os.environ["DB_NAME"],
                port=int(os.environ["DB_PORT"]),
            )
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Wrong credentials")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("DB does not exist")
            else:
                print(err)
            time.sleep(delay**attempt)
            attempt += 1
    raise Exception("Failed to connect to the database")
