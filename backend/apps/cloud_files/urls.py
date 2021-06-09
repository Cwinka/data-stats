import csv

from config import app
from fastapi import Depends, File, UploadFile
from settings import Auth
from storages.userStore import UserStore
from utils_ import ValidFilenamesOrHttpException

from models.files import FilePointer
from models.users import BaseUser

from .models import Created, Deleted, FileExists
from .routers import cloud_file_router, csv_router
from .utils import FileDeleter, IncomingFile


@cloud_file_router.put(f"/exists", response_model=FileExists)
async def exists(fp: FilePointer, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """ Checks exists user's file in cloud or not """
    ValidFilenamesOrHttpException([fp.filename])
    return {"detail": { "exists": await UserStore(user).file_exists(fp.filename)}}

@cloud_file_router.delete(f"/delete", response_model=Deleted, status_code=200)
async def delete_file(
    fp: FilePointer,
    user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """ Deletes a user file according to the filename """
    deleter = FileDeleter(user, fp)
    await deleter.deleteOrHTTPException()
    return {**deleter.status_as_dict(), "filename": fp.filename}

@csv_router.post(f"/upl", response_model=Created, status_code=201)
async def upload(
    user: BaseUser = Depends(Auth.getBaseUserIfTokenValid),
    data: UploadFile = File(None)):
    """ Uploads a user data file to the server in a user directory """
    file = IncomingFile(user, data)
    await file.uploadOrHTTPException()
    return {**file.status_as_dict(), "filename": file.filename}

@cloud_file_router.get("/list")
async def filesInfo_list(user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """ Returns user's file's information which are in the cloud """
    return {"detail": {"files": await UserStore(user).filenames_list()}}

@cloud_file_router.get("/left")
async def space_left(user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """ Returns user free space available in the cloud storage """
    free_space, overall = await UserStore(user).free_space_left()
    return {"detail": {"left": free_space, "overall": overall}}

@cloud_file_router.get("/first_ten")
async def get_first_ten_rows(filename: str, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    ValidFilenamesOrHttpException([filename])
    file = await UserStore(user).fetch_file(filename)
    csv_data = csv.reader(file, delimiter=",")
    ten = []
    c = 0
    for row in csv_data:
        if c >10:
            break
        ten.append(row)
        c+=1
    return {"detail": ten}

app.include_router(csv_router)
app.include_router(cloud_file_router)
