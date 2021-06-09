import random
from collections import defaultdict
from typing import Tuple

import pandas as pd
from storages.userStore import UserStore

from models.files import FilePointer
from models.users import BaseUser

from .models import ScatterGraph
from .utils import catch_no_column

MAX_SAMPLES_IN_OUTPUT = 500

@catch_no_column
async def scatter_matrix(fp: FilePointer, sett: ScatterGraph, user:BaseUser):
    source = await UserStore(user).fetch_file(fp.filename)
    df = pd.read_csv(source)
    x_axis = list(df[sett.x_column])
    y_axis = list(df[sett.y_column])
    return {"scatter": Scatter(x_axis, y_axis).content}

class Point:
    def __init__(self, raw_point: list) -> None:
        self._x, self._y = [float(x) for x in raw_point[0].split(" ")]
        self._density = float(raw_point[1])
    
    @property
    def content(self):
        return {"x": self._x, "y": self._y, "density": self._density}

class Scatter:
    
    def __init__(self, x_axis: list, y_axis: list) -> None:
        self._content = []
        self._x_axis, self._y_axis = x_axis, y_axis
        self._len_x_axis = len(x_axis)
        self._fill_scatter_with_points_content()

    def _fill_scatter_with_points_content(self):
        sample_range = range(self._len_x_axis) \
                        if self._len_x_axis < MAX_SAMPLES_IN_OUTPUT \
                        else self._random_unic_indexes_in_x_axis_array()
        accumulation = defaultdict(int)
        for idx in sample_range:
            v1, v2 = self._get_axises_values_by_index(idx)
            if v1 and v2:
                accumulation[f"{v1:.1f} {v2:.1f}"] += 1
            
        for raw_point in accumulation.items():
            self._content.append(Point(raw_point).content)

    def _get_axises_values_by_index(self, idx: int) -> Tuple[float, float]:
        try:
            v1, v2 = float(self._x_axis[idx]), float(self._y_axis[idx])
            if pd.isna(v2) or pd.isna(v1):
                return .0,.0
            return v1, v2
        except ValueError:
            return .0,.0

    def _random_unic_indexes_in_x_axis_array(self):
        rn = list(range(self._len_x_axis))[:MAX_SAMPLES_IN_OUTPUT]
        random.shuffle(rn)
        for x in rn:
            yield x

    @property
    def content(self) -> list:
        return self._content
