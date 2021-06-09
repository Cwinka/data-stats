from pydantic import BaseModel

class BaseGraph(BaseModel):
    x_column: str

    class Config:
        schema_extra  = {
            "example": {
                "x_column": "price",
            }
        }