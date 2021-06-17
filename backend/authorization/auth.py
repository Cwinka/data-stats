from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Union
from models.users import BaseUser
from models.token import TokenData
from storages.globals.manager import _Storage
from config import SECRET_KEY, ALGORITHM
from loguru import logger

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="")

class _Auth:
    _credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    def __init__(self, store: _Storage) -> None:
        self._store = store

    async def getBaseUserIfTokenValid(self, token: str = Depends(oauth2_scheme)) -> Union[BaseUser, Exception]:
        """ Checks is_ field on user from db. If False, raise an exception"""
        user = await self._getUserFromDBIfTokenValid(token)
        return user

    async def _getUserFromDBIfTokenValid(self, token: str = Depends(oauth2_scheme)) -> Union[BaseUser, Exception]:
        decoded_token = await self.decodeTokenOrCredExcepton(token)
        user = await self._store.accounts.fetch_user(decoded_token.email)
        if user is None:
            raise self._credentials_exception
        return user

    async def decodeTokenOrCredExcepton(self, token:str) -> Union[TokenData, Exception]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("id")
            if user_id is None:
                raise self._credentials_exception
        except JWTError:
            raise self._credentials_exception
        
        return TokenData(**payload)