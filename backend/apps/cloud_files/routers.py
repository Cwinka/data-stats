from typing import Callable
from fastapi import  Request, Response, APIRouter, HTTPException
from fastapi.routing import APIRoute
from loguru import logger
from config import API_VER, MAX_DATA_SIZE
from models.status import BadRequest, NotAuthorized, NotFound
from multipart.exceptions import MultipartParseError
import os


# Just a case for usage
class CsvFilesOnlyRequest(APIRoute):
    CSV_TYPE = "application/vnd.ms-excel"

    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            try:
                files = await request.form()
            except MultipartParseError: # emty bytes
                raise HTTPException(400, "empty file")
            for _, fl in files.items():
                self._check_fl_empty(fl)
                size = self._filesize(fl.file)
                self._check_max_size(size)
                self._check_content_type(fl)
            logger.warning("Incoming file from")
            response: Response = await original_route_handler(request)
            return response

        return custom_route_handler
    
    def _check_fl_empty(self, fl):
        if not fl:
            raise HTTPException(400, "empty file")
    
    def _check_max_size(self, size: int) -> None:
        if size > MAX_DATA_SIZE:
            raise HTTPException(413, f"max file size exceeded. Max size is {MAX_DATA_SIZE} bytes, your size is {size}")

    def _check_content_type(self, fl) -> None:
        if not fl.content_type == self.CSV_TYPE:
            raise HTTPException(400, "not a csv file")

    def _filesize(self, file) -> int:
        file.seek(0, os.SEEK_END) #!
        size = file.tell() #!
        file.seek(0) #!
        return size

common_responses = {
    400: {"model": BadRequest},
    401: {"model": NotAuthorized}
}
file_interract_resp = {
    **common_responses,
    404: {"model": NotFound}
}

csv_router = APIRouter(
    prefix=f"/{API_VER}/cloud/files",
    tags=["cloud files"],
    route_class=CsvFilesOnlyRequest,
    responses=common_responses,
)
cloud_file_router = APIRouter(
    prefix=f"/{API_VER}/cloud/files",
    tags=["cloud files"],
    responses=common_responses,
)