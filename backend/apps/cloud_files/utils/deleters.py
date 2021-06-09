from fastapi import HTTPException
from storages.userStore import UserStore

from models.files import FilePointer
from models.users import BaseUser
from utils_ import NamesProtection

class FileDeleter(NamesProtection):
    """ Provides functionality to checks incoming incof before delete user files """
    def __init__(self, user: BaseUser, fp: FilePointer):
        self._filename = fp.filename
        self._store = UserStore(user)
    
    @property
    def filenames_list(self) -> list:
        return [self._filename]
    
    async def can_be_deleted(self) -> bool:
        """ Can file be deleted or not. Updetes status """
        if not super().is_valid_filenames():
            return False
        if not await self._store.file_exists(self._filename):
            self.set_status(404, "file does not exists")
            return False
        return True
    
    async def delete(self):
        """ Deletes file from cloud """
        await self._store.delete_file(self._filename)
        self.set_status(200, "deleted")

    async def deleteOrHTTPException(self):
        if await self.can_be_deleted():
            await self.delete()
        else:
            raise HTTPException(*self.status_as_tuple())
            
    
