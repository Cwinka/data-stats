from io import StringIO
from typing import IO, Tuple
from settings import Store
from models.users import BaseUser

class UserStore:
    def __init__(self, user: BaseUser) -> None:
        self._user = user

    async def fetch_file(self, filename:str) -> StringIO:
        """ Fetches specified file """
        return await Store.files.fetch_one(self._user, filename)

    async def fetch_file_in_bytes(self, filename:str) -> bytes:
        """ Fetches specified file """
        return await Store.files.fetch_one_bytes(self._user, filename)

    async def upload_file(self, file: IO, filename: str) -> str:
        """ Uploads incoming file """
        return await Store.files.upload(self._user, file, filename)

    async def delete_file(self, filename: str) -> str:
        """ Deletes specified file """
        return await Store.files.delete(self._user, filename)

    async def file_exists(self, filename:str) -> bool:
        """ Exists specified file or not """
        return await Store.files.exists(self._user, filename)
    
    async def free_space_left(self) -> Tuple[float, float]:
        return await Store.files.free_space_left(self._user)

    async def filenames_list(self) -> list:
        return await Store.files.files_list(self._user)