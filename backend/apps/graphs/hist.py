from typing import List

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from numpy.lib.function_base import iterable
from storages.userStore import UserStore

from models.files import FilePointer
from models.graph import BaseGraph
from models.users import BaseUser

from .utils import catch_no_column


@catch_no_column
async def histogramm(fp: FilePointer, sett: BaseGraph, user: BaseUser):
    """ Creates a histogramm of the specified column. If no such column, raise 404 error.
        Returns dict[
            x_axis: list(int),
            y_axis: list(int)
        ]
    """
    source = await UserStore(user).fetch_file(fp.filename)
    data = pd.read_csv(source)
    axises = ndarrays_to_lists(plt.hist(data[sett.x_column]))
    # axises[1] - x axis, axises[0] - y axis
    return {'hist': Histogram(axises[1], axises[0]).content}

def ndarrays_to_lists(sequence: iterable) -> List[list]:
    """ Convert all ndarray types in the sequence to lists """
    return [list(x) for x in sequence if type(x) == np.ndarray]

class Column:
    def __init__(self, interval: List[int], y: int) -> None:
        self._interval = f"{interval[0]:.2f} - {interval[1]:.2f}"
        self._count_of_values_in_iterval = y

    @property
    def content(self) -> dict:
        return {"x_axis": self._interval,
                "y_axis": self._count_of_values_in_iterval}

class Histogram:
    def __init__(self, x_axis:list, y_axis:list) -> None:
        self._content = []
        self._fill_histogram_with_columns(x_axis, y_axis)

    def _fill_histogram_with_columns(self, x_axis:list, y_axis:list):
        """ Fill histogram with Columns """
        for i in range(len(x_axis)-1):
            if y_axis[i] != 0: # only if y value present
                self._content.append(Column([x_axis[i], x_axis[i+1]], y_axis[i]).content)
    @property   
    def content(self):
        return self._content
