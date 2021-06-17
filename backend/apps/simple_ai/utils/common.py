from functools import wraps
from typing import Union
from models.users.models import BaseUser
from random import randint
from storages.userStore import UserStore

import numpy as np
import pandas as pd
from fastapi import HTTPException
from loguru import logger
from sklearn import preprocessing
from sklearn.model_selection import train_test_split

from ..models import BaseSetting


def catch_no_column(f):
    """ Catch all KeyError errors and raise HTTP execption 404. Only async func """
    @wraps(f)
    def wrap(*a, **kw):
        try:
            return f(*a, **kw)
        except KeyError as e:
            raise HTTPException(404, f"column {e} not found")
    return wrap

class BasePrepareOperations:
    def __init__(self, user: BaseUser, settings: BaseSetting) -> None:
        self._settings = self.getValidSettingOrHTTPException(settings)
        self._encoder = preprocessing.LabelEncoder()
        self._store = UserStore(user)
        self._dropped_cols = []
        self._new_cols = []
        self._predic_changed = {}
    
    @property
    def sanitize_report(self) -> dict:
        return {"dropped": self._dropped_cols,
                "predict_map": self._predic_changed,
                "new_columns": self._new_cols}
    
    def getValidSettingOrHTTPException(self, settings: BaseSetting):
        if 0.05 < settings.test_size > 1:
            raise HTTPException(400, "Test size must be in interval [0.05; 1]")
        return settings

    async def getFileAndApplyBaseSettings(self) -> Union[pd.DataFrame, HTTPException]:
        source = await self._store.fetch_file(self._settings.filename)
        train_data = self._considerWhiteAndBlackLists(pd.read_csv(source))
        return self._sanitize(train_data)
    
    def _considerWhiteAndBlackLists(self, array: pd.DataFrame) -> pd.DataFrame:
        if self._settings.white_set:
            return self._drop_not_in_white(array)
        if self._settings.black_set:
            return self._drop_black_list(array)
        return array
    
    def _drop_not_in_white(self, array: pd.DataFrame) -> pd.DataFrame:
        diff = self._settings.white_set - set(array.columns)
        if diff:
            raise HTTPException(404, f"Columns {diff} are not in data")

        not_in_white_list = [x for x in array.columns if x not in self._settings.white_set and x != self._settings.predict]
        self._dropped_cols.extend((x, "Not in white list") for x in not_in_white_list)
        return array.drop(not_in_white_list, axis=1)

    def _drop_black_list(self, array: pd.DataFrame) -> pd.DataFrame:
        diff = self._settings.black_set - set(array.columns)
        if diff:
            raise HTTPException(404, f"Columns {diff} are not in data")

        in_black_list = [x for x in self._settings.black_set if x in array.columns]
        self._dropped_cols.extend((x, "In black list") for x in in_black_list)
        return array.drop(in_black_list, axis=1)
    
    @catch_no_column
    def _sanitize(self, array: pd.DataFrame) -> tuple:
        array = array.dropna()
        
        not_numeric_cols_except_predict = (x for x in array.columns
                                            if x != self._settings.predict and not \
                                            np.issubdtype(array[x].dtypes, np.number))
        # not numeric col
        dropped = []
        reasons = []
        for column in not_numeric_cols_except_predict:
            unic_vals = array[column].unique()
            if 1 < len(unic_vals) < 7:
                logger.warning(f"Column {column} can be flatten")
                for val in unic_vals:
                    array[f"{column}-{val}"] = (array[column] == val).astype(int)
                    self._new_cols.append(f"{column}-{val}")
                dropped.append(column)
                reasons.append("Replaced")
            else:
                dropped.append(column)
                reasons.append("Too many strings values")

        array = array.drop(dropped, axis=1)
        self._dropped_cols.extend(list(zip(dropped, reasons)))
        
        if len(array.columns) < 2:
            raise HTTPException(
                404,
                f"Cannot process because columns {dropped} have null or strings values")

        # predict not numeric col
        hash_replaced_values = {}
        if not np.issubdtype(array[self._settings.predict].dtypes, np.number):
            unic_vals = array[self._settings.predict].unique()
            if 1 <= len(unic_vals) < 50:
                for i,val in enumerate(unic_vals):
                    hash_replaced_values[val] = i
                array[self._settings.predict] = [hash_replaced_values[x] for x in array[self._settings.predict]]
            else:
                raise HTTPException(
                    400,
                    "[CONVERT ERROR] Too many string values in predict column.\
                    Replace them to numeric values or lessen them up to 50 unic ones")
        self._predic_changed = {self._settings.predict: hash_replaced_values}

        return array
    
    def split_for_x_y(self, array: pd.DataFrame):
        rest_cols = [x for x in array.columns if x != self._settings.predict]
        return train_test_split(array[rest_cols],
                                array[self._settings.predict],
                                test_size=self._settings.test_size,
                                random_state=randint(0, len(array)) if not\
                                    self._settings.fixed_random else 42)
    
    
