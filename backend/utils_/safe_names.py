
from abc import ABC, abstractmethod
from typing import List

from fastapi import HTTPException

from .status import Status


class MetaValidator(ABC):
    @property
    @abstractmethod
    def filenames_list(self) -> List[str]: ...

class NamesProtection(Status, MetaValidator):
    """ Restricts characters in names. Can only be parent class.
        Child must have filenames_list property
    """
    _EVAL_CHARS = ["/", "\\", "?", "!"]
    _BAD_CONDITION_CODES = [400]

    def is_valid_filenames(self) -> bool:
        """ Check filenames characters. Updates status """
        for name in self.filenames_list:
            self._too_short_name(name)
            self._no_extention(name)
            self._starts_with_dot(name)
            self._contains_eval_chars(name)
            if self.status_code in self._BAD_CONDITION_CODES:
                return False
        return True

    def _too_short_name(self, name) -> None:
        if len(name) < 3:
            self.set_status(400, f"min length of the filename is 3 characters. Your filename is '{name}'")
    def _no_extention(self, name) -> None:
        if name.endswith(".") or ('.' not in name):
            self.set_status(400, f"filename must contain an extention. Your filename is '{name}'")
    def _starts_with_dot(self, name) -> None:
        if name.startswith("."):
            self.set_status(400, f"filename must't start with ' . '. Your filename is '{name}'")
    def _contains_eval_chars(self, name) -> None:
        if set(name) & set(self._EVAL_CHARS):
            self.set_status(400, f"filename contains forbiden characters, \
                                        your filename is '{name}'. \
                                        Remove these chars from the filename {' '.join(self._EVAL_CHARS)}")

class ValidFilenamesOrHttpException(NamesProtection):
    def __init__(self, filenames:list):
        self._filenames = filenames
        if not self.is_valid_filenames():
            raise HTTPException(*self.status_as_tuple())

    @property
    def filenames_list(self):
        return self._filenames
