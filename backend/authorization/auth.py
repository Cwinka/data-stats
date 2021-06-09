from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Union
from models.users.models import AdminUser, BaseUser, UserInDB
from models.token import TokenData
from storages.globals.manager import _Storage
from config import DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES, CRYPT_SCHEMAS, SECRET_KEY, ALGORITHM

pwd_context = CryptContext(schemes=CRYPT_SCHEMAS, deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class _Auth:
    _credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    def __init__(self, store: _Storage) -> None:
        self._store = store

    async def getAdminUserIfTokenValid(self, token: str = Depends(oauth2_scheme)) -> Union[AdminUser, Exception]:
        """ Checks is_ field on user from db. If False, raise an exception"""
        user = await self._getUserFromDBIfTokenValid(token)
        if not user.is_:
            raise HTTPException(status_code=400, detail="Not enough rights")
        return AdminUser(**user.dict())

    async def getBaseUserIfTokenValid(self, token: str = Depends(oauth2_scheme)) -> Union[AdminUser, Exception]:
        """ Checks is_ field on user from db. If False, raise an exception"""
        user = await self._getUserFromDBIfTokenValid(token)
        return BaseUser(**user.dict())

    async def _getUserFromDBIfTokenValid(self, token: str = Depends(oauth2_scheme)) -> Union[UserInDB, Exception]:
        decoded_token = await self.decodeTokenOrCredExcepton(token)
        user = await self._store.accounts.fetch_user(decoded_token.username) #!
        if user is None:
            raise self._credentials_exception
        return user

    async def decodeTokenOrCredExcepton(self, token:str) -> Union[TokenData, Exception]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise self._credentials_exception
        except JWTError:
            raise self._credentials_exception
        
        return TokenData(username=username)

    async def authenticateUserOrCredExeception(self, username: str, password: str) -> Union[UserInDB, Exception]:
        user = await self._store.accounts.fetch_user(username)
        if not user:
            raise self._credentials_exception
        if not self._verify_password(password, user.psw):
            raise self._credentials_exception
        return user
    
    async def create_access_token(self, for_encode: dict) -> str:
        for_encode = for_encode.copy()
        expire = datetime.utcnow() + timedelta(minutes=DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES)
        for_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(for_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def _verify_password(raw: str, encoded: str) -> bool:
        """ Verifies incoming password with hashed password """
        return pwd_context.verify(raw, encoded)

    @staticmethod
    def get_password_hash(ps) -> str:
        """ Return hashed version of the password """
        return pwd_context.hash(ps)

    
    
    
    
    
    
    
