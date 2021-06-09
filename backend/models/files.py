from pydantic import BaseModel, Field

class FilePointer(BaseModel):
    """ Class witch point to the user file """
    filename: str = Field(..., description="A user file wich contains data, usualy in csv format")

    class Config:
        schema_extra  = {
            "example": {
                "filename": 'any.csv'
            }
        }

