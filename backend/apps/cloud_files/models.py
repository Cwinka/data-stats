from pydantic import BaseModel


class ExistsDetails(BaseModel):
    exists: bool
    class Config:
        schema_extra = {
            "example": {
                "exists": True
            }
        }
class FileExists(BaseModel):
    detail: ExistsDetails


class DeletedDetails(BaseModel):
    status_code: int
    message: str

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "message": "deleted",
            }
        }

class CreatedDetails(BaseModel):
    status_code: int
    message: str
    
    class Config:
        schema_extra = {
            "example": {
                "status_code": 201,
                "message": "uploaded",
            }
        }

class Deleted(BaseModel):
    detail: DeletedDetails
    filename: str

class Created(BaseModel):
    detail: CreatedDetails
    filename: str