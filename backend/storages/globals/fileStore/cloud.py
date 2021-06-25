import os
from .baseFileStorage import BaseFileStorage
from typing import IO, List, Tuple

import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException
from models.users import BaseUser
from loguru import logger
from config import (
    ENDPOINT_S3,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY ,
    BUCKET_NAME,
    SSE_KMS_KEY_ID ,
    USER_UPLOADS_DIR,
    MAX_ALL_FILES_SIZE
)

class Cloud(BaseFileStorage):
    """ Model for managing cloud files """

    def __init__(self) -> None:
        session = boto3.session.Session()
        try:
            self.s3 = session.client(
                service_name='s3',
                endpoint_url=ENDPOINT_S3,
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            )
        except ValueError as e:
            logger.error(f"[CLOUD ERROR] Could not connet to cloud. Error {e}")
    
    def ping(self):
        try:
            self.s3.list_buckets()
            return True
        except ClientError:
            logger.error("[CLOUD ERROR] Could not connect to cloud service")
        except AttributeError:
            return False
        return False
    async def free_space_left(self, user: BaseUser) -> Tuple[float, float]:
        """ Returns available user space in bytes """
        space_in_use = sum(map(lambda x: x['Size'], await self.files_list(user)))
        return float(MAX_ALL_FILES_SIZE-space_in_use), MAX_ALL_FILES_SIZE

    async def files_list(self, user: BaseUser) -> List[str]:
        """ Returns the user uploaded files list """
        out_fields = ['Size', 'LastModified']
        resp = self.s3.list_objects(Bucket=BUCKET_NAME, Prefix=f"{user.dp}/{USER_UPLOADS_DIR}")
        try:
            content: List[dict] = resp['Contents']
        except KeyError:
            return []
        filename_list = []
        for file_ in content:
            out_file = {"filename": os.path.split(file_['Key'])[-1]}
            for field in out_fields:
                out_file[field] = file_[field]
            filename_list.append(out_file)
        return filename_list

    async def upload(self, user: BaseUser, file:IO, filename:str) -> str:
        """ Upload the file to the cloud service """
        self.s3.put_object(Bucket=BUCKET_NAME,
                    Key=f"{user.dp}/{USER_UPLOADS_DIR}/{filename}",
                    Body=file,
                    Metadata={"user": user.dp},
                    ServerSideEncryption='aws:kms',
                    SSEKMSKeyId=SSE_KMS_KEY_ID,
                    ACL='private')
        return filename

    async def file_exists(self, user: BaseUser, filename:str) -> bool:
        resp = self.s3.list_objects(Bucket=BUCKET_NAME, Prefix=f"{user.dp}/{USER_UPLOADS_DIR}/{filename}")
        try:
            content = resp['Contents'][0]
        except KeyError:
            return False
        filename = os.path.split(content['Key'])[-1]
        return True if filename else False

    async def get_file(self, user: BaseUser, filename:str) -> Tuple[str, bytes]:
        try:
            object_response = self.s3.get_object(
                Bucket=BUCKET_NAME,
                Key=F'{user.dp}/{USER_UPLOADS_DIR}/{filename}')
        except ClientError as e:
            if e.response['Error']['Code'] == "NoSuchKey":
                raise HTTPException(404, "file not found")
            raise
        contex = object_response['Body'].read()
        return filename, contex

    async def delete_file(self, user: BaseUser, filename:str) -> str:
        self.s3.delete_object(Bucket=BUCKET_NAME, Key=f"{user.dp}/{USER_UPLOADS_DIR}/{filename}")
        return filename