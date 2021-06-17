from io import StringIO
from typing import IO, Tuple, Union

from models.users import BaseUser

from .cacheFile import cache
from .cloud import Cloud
from .local import Local


class Files:
    def __init__(self) -> None:
        self.file_storage = self._init_file_storage()

    def _init_file_storage(self) -> Union[Cloud, Local]:
        cloud = Cloud()
        if cloud.ping():
            return cloud
        return Local()

    async def fetch_one(self, user: BaseUser, filename:str) -> StringIO:
        """ Fetches specified user file """
        in_cache = cache.get_file(user, filename)
        if not in_cache:
            _, file = await self.file_storage.get_file(user, filename)
            cache.cache_file(user, filename, file)
            return StringIO(file.decode(encoding="utf-8-sig"))
        return StringIO(in_cache.decode(encoding="utf-8-sig"))

    async def upload(self, user: BaseUser, file: IO, filename: str) -> str:
        """ Uploads incoming user file """
        return await self.file_storage.upload(user, file, filename)

    async def delete(self, user: BaseUser, filename: str) -> str:
        """ Deletes specified user file """
        return await self.file_storage.delete_file(user, filename)

    async def exists(self, user: BaseUser, filename:str) -> bool:
        """ Exists specified user file or not """
        return await self.file_storage.file_exists(user, filename)
    
    async def free_space_left(self, user: BaseUser) -> Tuple[float, float]:
        return await self.file_storage.free_space_left(user)

    async def files_list(self, user: BaseUser) -> list:
        return await self.file_storage.files_list(user)
