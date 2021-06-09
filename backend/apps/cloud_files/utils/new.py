import os
from typing import IO

from fastapi import HTTPException, UploadFile
from models.users import BaseUser
from storages.userStore import UserStore

from .secure import IncomingFileProtection


class BufferedFile(
    IncomingFileProtection):
    """ New buffered file from the web """
    def __init__(self, file: IO, filename:str):
        self._file = file
        self._filename = filename

    @property
    def iofile(self):
        return self._file

    @property
    def filename(self):
        return self._filename

    @property
    def filenames_list(self):
        return [self._filename]

class IncomingFile(BufferedFile):
    """ Incoming file from an authorized user """

    def __init__(self, user: BaseUser, file: UploadFile):
        super().__init__(
            file=file.file, # raw io file
            filename=file.filename)
        self._store = UserStore(user)
 
    async def uploadOrHTTPException(self):
        if await self.can_be_uploaded():
            await self._store.upload_file(self.iofile, self.filename)
            self.set_status(201, "uploaded")
        else:
            raise HTTPException(*self.status_as_tuple())

    async def can_be_uploaded(self):
        if not (await super().can_be_uploaded()):
            return False
        if not (await self._enough_space_left()):
            return False
        return True
        
    async def _enough_space_left(self) -> bool:
        size = self._filesize()
        rest = await self._available_space()
        if rest - size < 0:
            self.set_status(400, f"Not enough space to save the file")
            return False
        return True

    def _filesize(self) -> int:
        self.iofile.seek(0, os.SEEK_END) #!
        size = self.iofile.tell() #!
        self.iofile.seek(0) #!
        return size
    
    async def _available_space(self) -> float:
        rest, _ = await self._store.free_space_left()
        return rest
