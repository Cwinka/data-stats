
import sys, os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__name__)))) #3 level above
sys.path.append(BASE_DIR)

from storages.globals.cacheStore import Redis
from models.users.models import BaseUser
import asyncio

TEST_USER = BaseUser(**{"dp": "TEST", "username": "joehndoe"})
TEST_FILENAME = "unbelivable.csv"
FILE_CONTENT ="1,2,3,4,5\nm,m,m,m,m,m"

cache = Redis()

def test_cache_file():
    file = bytes(FILE_CONTENT, encoding="utf-8")
    res = cache.cache_file(TEST_USER, TEST_FILENAME, file)
    assert res == TEST_FILENAME

def test_get_file():
    file = cache.get_file(TEST_USER, TEST_FILENAME)
    assert file == bytes(FILE_CONTENT, encoding="utf-8")

def test_get_not_existing_file():
    file = cache.get_file(TEST_USER, "no existing file")
    assert file is None



