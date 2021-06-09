from config import app
from fastapi import Depends

from settings import Auth
from fastapi.security import OAuth2PasswordRequestForm
from models.token import Token
from .utils import get_access_token


@app.post("/token", response_model=Token, tags=['access token'])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await Auth.authenticateUserOrCredExeception(form_data.username, form_data.password)
    access_token = await get_access_token(user)
    return {"access_token": access_token, "token_type": "bearer"}
