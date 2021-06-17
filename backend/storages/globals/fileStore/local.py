from fastapi.exceptions import HTTPException
from loguru import logger
from .baseFileStorage import BaseFileStorage
from models.users import BaseUser
from typing import Tuple, List, IO
from os.path import join, exists, isfile
from os import stat, stat_result, listdir, makedirs, SEEK_END, remove
from config import MAX_ALL_FILES_SIZE, ROOT_DIR

USERS_DIRECTORY = "users"

class FileInfo:
    def __init__(self, filename:str, stat: stat_result) -> None:
        self.Size =  stat.st_size
        self.LastModified = stat.st_mtime
        self.filename = filename


class Local(BaseFileStorage):
    _min_chunk_size = 1024 * 1024 # bytes 1M
    _max_chunk_size = 1024 * 1024 * 16 # bytes 16M
    _chunk_percent = 0.1 # 0 - 1

    def __init__(self) -> None:
        logger.warning("[FILE SYSTEM] Using file system to manipulate users files")

    async def free_space_left(self, user: BaseUser) -> Tuple[float, float]:
        """ Returns available user space in bytes """
        space_in_use = sum([x.Size for x in await self.files_list(user)])
        return float(MAX_ALL_FILES_SIZE-space_in_use), MAX_ALL_FILES_SIZE

    async def files_list(self, user: BaseUser) -> List[FileInfo]:
        """ Returns the user uploaded files list """
        user_dir = self._get_user_dir(user)
        if not self._path_exists(user_dir):
            return []
        return [FileInfo(x, stat((join(user_dir, x))))
                for x in listdir(user_dir) if
                isfile(join(user_dir, x))]
    
    def _get_user_dir(self, user: BaseUser) -> str:
        return join(ROOT_DIR, USERS_DIRECTORY, user.dp)
    
    def _path_exists(self, path: str) -> bool:
        return exists(path)

    async def upload(self, user: BaseUser, file:IO, filename:str) -> str:
        """ Upload the file to the cloud service """
        to_file = self._make_path_to_upload(user, filename)
        
        size = self._filesize(file)
        chunk_size = int(size * self._chunk_percent)
        if chunk_size < self._min_chunk_size:
            chunk_size = self._min_chunk_size
        elif chunk_size > self._max_chunk_size:
            chunk_size = self._max_chunk_size
        
        f = open(to_file, 'ab')
        chunk = self._get_chunk(size, chunk_size, file)
        try:
            while chunk:
                f.writelines(chunk)
                chunk = self._get_chunk(size, chunk_size, file)
        finally:
            f.close()
        file.close()
        return filename
    
    def _make_path_to_upload(self, user: BaseUser, filename: str) -> str:
        """ Makes dirs to the upload folder """
        user_dir = self._get_user_dir(user)

        if not self._path_exists(user_dir):
            makedirs(user_dir)

        to_file = join(user_dir, filename)
        if self._path_exists(to_file):
            with open(to_file, 'w') as f:
                f.write("")
        return to_file

    def _filesize(self, file: IO):
        file.seek(0, SEEK_END) #!
        size = file.tell() #!
        file.seek(0) #!
        return size

    def _get_chunk(self, filesize:int, chunk_size:int, file: IO):
        """ Returns part of data from a file according to chunk_size """
        rest_b = filesize - file.tell()
        if rest_b < chunk_size:
            chunk_size = rest_b
        return file.readlines(chunk_size)

    async def file_exists(self, user: BaseUser, filename:str) -> bool:
        user_dir = self._get_user_dir(user)
        return exists(join(user_dir, filename))

    async def get_file(self, user: BaseUser, filename:str) -> Tuple[str, bytes]:
        user_dir = self._get_user_dir(user)
        to_file = join(user_dir, filename)
        if not exists(to_file):
            raise HTTPException(404, "file not found")
        with open(to_file, 'rb') as f:
            content = f.read()
        return filename, content

    async def delete_file(self, user: BaseUser, filename:str) -> str:
        user_dir = self._get_user_dir(user)
        to_file = join(user_dir, filename)
        remove(to_file)
        return filename
    