#!/usr/bin/env python
# simply downloading the entire database was a naive solution lmaoooo
# 17 gb (ㆆ _ ㆆ)
import mysql.connector
# instead imma try to use MySQL Connector Python to upload straight from mySQL

from mysql.connector import Error
import os

auth = os.environ['privacyPwd']

def connect():
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='TAGDATA',
                                             user='root',
                                             password=auth)
        if connection.is_connected():
            print("connection success")
            query(connection.cursor())
    except Error as e:
        print("Error when connecting to MySQL", e)
    finally:
        if connection.is_connected():
            connection.close()
            print("connection closed")

def query(cursor):
    # sql query -> json formatting
    sql = '''SHOW TABLES;'''
    cursor.execute(sql)
    result = cursor.fetchone()
    print(result)
connect()