from io import StringIO
import sys, os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__name__)))) #3 level above
sys.path.append(BASE_DIR)

from storages.userStore import UserStore
from models.users.models import BaseUser
import asyncio

TEST_USER = BaseUser(**{"dp": "TEST", "username": "joehndoe"})
store = UserStore(TEST_USER)

TEST_FILENAME = "unbelivable.csv"
FILE_CONTENT ="1,2,3,4,5\nm,m,m,m,m,m"

def test_file_upload():
    file = bytes(FILE_CONTENT, encoding="utf-8")
    res = asyncio.run(store.upload_file(file, TEST_FILENAME))
    assert type(res) == str
    assert res == TEST_FILENAME

def test_list_files():
    files = asyncio.run(store.filenames_list())
    assert type(files) == list

def test_free_space_left():
    result = asyncio.run(store.free_space_left())
    rest, overall = result
    assert len(result) == 2, "Must be two digits, rest space, all space"
    assert rest <= overall, "Free space cannot be more than available space"
    assert type(rest/2) == type(overall/2), "Types must be the same after division"
    assert overall*2 > overall, "Unxpected behavior"

def test_file_exists():
    doesExist = asyncio.run(store.file_exists(TEST_FILENAME))
    assert doesExist == True

def test_fetch_file():
    file = asyncio.run(store.fetch_file(TEST_FILENAME))
    assert type(file) == StringIO
    assert file.read() == FILE_CONTENT, "Some information lost!"

def test_fetch_file_in_bytes():
    file = asyncio.run(store.fetch_file_in_bytes(TEST_FILENAME))
    assert type(file) == bytes
    assert file == bytes(FILE_CONTENT, encoding="utf-8"), "Some information lost!"

def test_delete_file():
    res = asyncio.run(store.delete_file(TEST_FILENAME))
    assert res == TEST_FILENAME

def test_file_does_not_exists():
    noExist = asyncio.run(store.file_exists(TEST_FILENAME))
    assert noExist == False 