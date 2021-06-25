import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from typing import List
from decouple import config

MAX_DATA_SIZE = config("MAX_DATA_SIZE", 30000000, cast=int) # 30Mb
""" Max data size in bytes """

API_VER: str = 'api_v0'
""" Current version of the api urls """

BASE_DIR: str = os.path.dirname(os.path.abspath(__name__))
""" Backend source files dir """

ROOT_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__name__)))
""" Directory upon the BASE_DIR """

USERS_DIR: str = config("USERS_DIR", 'users', cast=str)
""" Directory where all users tokens are stored """

USER_UPLOADS_DIR: str = config("USER_UPLOADS_DIR", 'uploads', cast=str)
""" Directory where all users uploads are saved.
    This directory is inside USER_DATA_DIR
"""
TO_USERS_DATA_DIR: str = os.path.join(ROOT_DIR, USERS_DIR)
""" Path to the users directory """

MAX_FILENAME_LENGTH = config("MAX_FILENAME_LENGTH", 30, cast=int) # caracters
""" Max number of characters in directory name. It's used to create a directory for user """

MAX_ALL_FILES_SIZE: int = config('MAX_ALL_FILES_SIZE', cast=int) # in bytes

DIRNAME_LENGTH: int = 20 # caracters
""" Used to generate a folder name for the user """

FIELDS_IN_TOKEN = [
    "is_"
]
""" Fields which will be injected in access token """

MODER_POINTER_FIELD = "is_"
""" Db field. If it's true then user is a moder """



tags_metadata = [
    {
        "name": "cloud files",
        "description": "Manage users files in the cloud.",
    },
    {
        "name": "graphics",
        "description": "Provides various of graphisc made on user's data",
    },
    {
        "name": "statistics",
        "description": "Provides various of statistics info made on user's data",
    },
]

app = FastAPI(
    title="Data analysis API",
    description="API provides functins to visualize data",
    version=0.1,
    openapi_tags=tags_metadata,
    # redoc_url=None,
    # docs_url=None,
)

ORIGINS: List[str] = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"]
)

REDIS_FILE_EXPIRE_SEC:int = config("REDIS_FILE_EXPIRE_SEC", cast=int)
REDIS_HOST: str = config("REDIS_HOST", cast=str)
REDIS_PORT:int = config("REDIS_PORT", cast=int)

# To decode token
SECRET_KEY = config("SECRET_KEY", cast=str)
ALGORITHM = config("ALGORITHM", cast=str)

ENDPOINT_S3 = config('ENDPOINT_S3', cast=str)
AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID", cast=str)
AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY", cast=str)
BUCKET_NAME = config("BUCKET_NAME", cast=str)
SSE_KMS_KEY_ID = config("SSE_KMS_KEY_ID", cast=str)
USER_UPLOADS_DIR: str = config("USER_UPLOADS_DIR", 'uploads', cast=str)
MAX_ALL_FILES_SIZE: str = config('MAX_ALL_FILES_SIZE', cast=int) # in bytes


DB_URL = config("DB_URL")