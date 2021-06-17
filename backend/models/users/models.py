from typing import Optional
from pydantic import BaseModel, Field

class BaseUser(BaseModel):
    email: str = Field(..., description="User email")
    full_name: Optional[str] = Field(None, description="User full name")
    isActivated: Optional[bool] = None

    @property
    def dp(self):
        return self.email
