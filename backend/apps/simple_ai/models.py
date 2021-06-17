from typing import List, Optional, Set

from fastapi.exceptions import HTTPException
from models.files import FilePointer


example = {
            "filename": 'any.csv',
            "predict": "quality",
            "fixed_random": False,
            "test_size": 0.33,
            "exclude_columns": [],
            "train_only_columns":  [],
        }

class BaseSetting(FilePointer):
    predict: str
    fixed_random: Optional[bool] = False
    test_size: Optional[float] = 0.33
    exclude_columns: Optional[Set[str]] = set()
    train_only_columns: Optional[Set[str]] = set()

    @property
    def black_set(self) -> set:
        if self.predict in self.exclude_columns:
            raise HTTPException(400, "Predict column in black list")
        return self.exclude_columns

    @property
    def white_set(self) -> set:
        if self.predict in self.train_only_columns:
            raise HTTPException(400, "Predict column in white list")
        return self.train_only_columns

    class Config:
        schema_extra  = {
            "example": example,
        }

class LinReg(BaseSetting):
    pass

class DesTree(BaseSetting):
    max_depth: Optional[int] = 2

    class Config:
        _example = example.copy()
        _example["max_depth"] = 2
        schema_extra  = {
            "example": _example,
        }