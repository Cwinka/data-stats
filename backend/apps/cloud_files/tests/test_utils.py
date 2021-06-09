
import sys, os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__name__))))) #4 levels above
sys.path.append(BASE_DIR)

from models.files import FilePointer
from apps.cloud_files.utils import IncomingFile, FileDeleter
from models.users import BaseUser
from fastapi import UploadFile
import asyncio
from io import BytesIO


TEST_USER = BaseUser(dp="TEST", username="johndoe")
TEST_FILENAME = "unbelivable.csv"
FILE_CONTENT = b"1,2,3,4,5\nm,m,m,m,m,m"
FILE = BytesIO(FILE_CONTENT)

def test_can_be_uploaded():
    corect_file = IncomingFile(TEST_USER, UploadFile(TEST_FILENAME, FILE))
    incorrect_file = IncomingFile(TEST_USER, UploadFile(TEST_FILENAME[:-3], FILE))
    asyncio.run(corect_file.can_be_uploaded())
    asyncio.run(incorrect_file.can_be_uploaded())

    status_code1, message1 = corect_file.status_as_tuple()
    status_code2, message2 = incorrect_file.status_as_tuple()

    assert status_code1 == 200
    assert message1 == "default"

    assert status_code2 == 400
    assert message2 != "default"
        
def test_can_be_deleted():
    deleter = FileDeleter(TEST_USER, FilePointer(filename=TEST_FILENAME))
    failed_delter = FileDeleter(TEST_USER, FilePointer(filename=TEST_FILENAME[:-3]))
    asyncio.run(deleter.can_be_deleted())
    asyncio.run(failed_delter.can_be_deleted())
    status_code1, message1 = deleter.status_as_tuple()
    status_code2, message2 = failed_delter.status_as_tuple()

    assert status_code1 == 200
    assert message1 == "default"

    assert status_code2 == 400
    assert message2 != "default"