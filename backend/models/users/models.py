from typing import Optional
from pydantic import BaseModel, Field

class BaseUser(BaseModel):
    username: str = Field(..., description="User login")
    dp: str = Field(..., description="User directory name")
    email: Optional[str] = Field(None, description="User email")
    full_name: Optional[str] = Field(None, description="User full name")
    disabled: Optional[bool] = None

class UserInDB(BaseUser):
    psw: str = Field(..., description="A user hashed password")
    is_: bool = Field(..., description="Whether a user admin or not")

class AdminUser(BaseUser):
    is_: bool = Field(..., description="Whether a user admin or not")
