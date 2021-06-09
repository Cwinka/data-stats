from pydantic import BaseModel, Field
from typing import List
from models.graph import BaseGraph

class HistogrammDetails(BaseModel):
    hist: List[dict]

class ScatterMatrixDetails(BaseModel):
    scatter: List[dict] = Field(..., description="First value of the 'x y' key is value of x_column,\
                                                    second value is a approximate value of the y_column. \
                                                    Key should treat as coordinates, value - concentration")

class ScatterMatrix(BaseModel):
    detail: ScatterMatrixDetails
    class Config:
        schema_extra = {
            "example": {
                "detail": {
                    "scatter": [
                        {"x": "1.0", "y": "10.1", "density": 62},
                        {"x": "1.2", "y": "9.1", "density": 30},
                    ]
                }
            }
        }

class Histogramm(BaseModel):
    detail: HistogrammDetails
    class Config:
        schema_extra = {
            "example": {
                "detail": {
                    "hist": [
                        {"x_axis": "2 - 3", "y_axis": 221},
                        {"x_axis": "3 - 4", "y_axis": 52},
                    ]
                }
            }
        }


class ScatterGraph(BaseGraph):
    y_column: str

    class Config:
        schema_extra  = {
            "example": {
                "x_column": "quality",
                "y_column": "price",
            }
        }