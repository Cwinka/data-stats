from io import StringIO
from typing import IO, Tuple

from models.users import BaseUser

from ..cacheStore import Redis
from .cloud import Cloud


class Files:
    def __init__(self) -> None:
        self.cache = Redis()
        self.file_storage = Cloud()

    async def fetch_one(self, user: BaseUser, filename:str) -> StringIO:
        """ Fetches specified user file """
        file_ = self.cache.get_file(user, filename)
        if not file_:
            _, file_ = await self.file_storage.get_file(user, filename)
            self.cache.cache_file(user, filename, file_)
        return StringIO(file_.decode(encoding="utf8"))

    async def fetch_one_bytes(self, user: BaseUser, filename:str) -> bytes:
        """ Fetches specified user file """
        file_ = self.cache.get_file(user, filename)
        if not file_:
            _, file_ = await self.file_storage.get_file(user, filename)
            self.cache.cache_file(user, filename, file_)
        return file_

    async def upload(self, user: BaseUser, file: IO, filename: str) -> str:
        """ Uploads incoming user file """
        return await self.file_storage.upload(user, file, filename)

    async def delete(self, user: BaseUser, filename: str) -> str:
        """ Deletes specified user file """
        return await self.file_storage.del_file(user, filename)

    async def exists(self, user: BaseUser, filename:str) -> bool:
        """ Exists specified user file or not """
        return await self.file_storage.file_exists(user, filename)
    
    async def free_space_left(self, user: BaseUser) -> Tuple[float, float]:
        return await self.file_storage.free_space_left(user)

    async def files_list(self, user: BaseUser) -> list:
        return await self.file_storage.files_list(user)
