"""
Модуль предоставляет родительские классы для наследования. Их цель предоставить
возможность проверить файловые имена либо входящий файл по разным критериям

The module provides parent classes for inheritance. Their goal is to provide
the ability to check file names or the incoming file according to different criteria
"""

from abc import ABC, abstractmethod
from typing import IO

from config import MAX_FILENAME_LENGTH
from utils_ import NamesProtection


class MetaFile(ABC):
    @property
    @abstractmethod
    def iofile(self) -> IO: ...

    @property
    @abstractmethod
    def filename(self) -> str: ...

class IncomingFileProtection(NamesProtection, MetaFile):
    """ Provides functionality to check file on different aspects. Can only be parent class.
        Child class must have iofile, filename, filenames_list properties
    """
    async def can_be_uploaded(self):
        """ Can file be saved or not. Updates status """
        if not self.iofile:
            self.set_status(404, "no file")
            return False 
        if not self.is_valid_filenames():
            return False
        if self._too_long_filename():
            self.set_status(400, "lendth of the filename must be less then 20 characters")
            return False
        return True
    
    def _too_long_filename(self) -> bool:
        return len(self.filename) > MAX_FILENAME_LENGTH
