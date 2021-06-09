from pydantic import BaseModel, Field

class BadRequest(BaseModel):
    detail: str

class NotFound(BaseModel):
    detail: str = Field("file not found")

class NotAuthorized(BaseModel):
    detail: str