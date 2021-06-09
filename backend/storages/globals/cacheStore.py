from typing import Union
import redis
from decouple import config
from models.users import BaseUser

REDIS_FILE_EXPIRE_SEC:int = config("REDIS_FILE_EXPIRE_SEC", cast=int)
REDIS_HOST: str = config("REDIS_HOST", cast=str)
REDIS_PORT:int = config("REDIS_PORT", cast=int)

class Redis:
    def __init__(self) -> None:
        self.r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)

    def get_file(self, user: BaseUser, filename:str) -> Union[bytes, None]:
        return self._get(self._extend_key(self._get_user_key(user), filename))

    def cache_file(self, user: BaseUser, filename:str, file: bytes) -> str:
        self._setex(self._extend_key(self._get_user_key(user), filename), file)
        return filename

    def _get(self, key:str):
        return self.r.get(key)
    
    def _setex(self, key:str, obj):
        self.r.setex(key, REDIS_FILE_EXPIRE_SEC, obj)

    def _set(self, key:str, obj):
        self.r.set(key, obj)

    def _get_user_key(self, user: BaseUser):
        return user.dp
    
    def _extend_key(self, key:str, *to_add: str) -> str:
        return f"{key}:" + ":".join(to_add)