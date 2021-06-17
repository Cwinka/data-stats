from io import StringIO
from typing import Union
from redis import Redis, ConnectionPool
from models.users import BaseUser
from config import REDIS_FILE_EXPIRE_SEC, REDIS_HOST, REDIS_PORT
from functools import wraps

POOL = ConnectionPool(host=REDIS_HOST, port=REDIS_PORT, db=0)
def get_connection(f):
    wraps(f)
    def wrap(*a, **kw):
        return f(*a, **kw, r=Redis(connection_pool=POOL))
    return wrap

class CacheBase:
    def get_file(self, user: BaseUser, filename:str) -> Exception:
        raise NotImplementedError
    def cache_file(self, user: BaseUser, filename:str, file: bytes) -> Exception:
        raise NotImplementedError

class _Redis(CacheBase):
    @get_connection
    def __init__(self, r:Redis) -> None:
        r.ping()

    def get_file(self, user: BaseUser, filename:str) -> Union[bytes, None]:
        return self._get(self._extend_key(self._get_user_key(user), filename))
    
    def cache_file(self, user: BaseUser, filename:str, file: Union[bytes, str]) -> str:
        self._setex(self._extend_key(self._get_user_key(user), filename), file)
        return filename
    
    @get_connection
    def _get(self, key:str, r: Redis):
        return r.get(key)

    def _extend_key(self, key:str, *to_add: str) -> str:
        return f"{key}:" + ":".join(to_add)
    
    def _get_user_key(self, user: BaseUser):
        return user.dp
    
    @get_connection
    def _setex(self, key:str, obj, r: Redis):
        r.setex(key, REDIS_FILE_EXPIRE_SEC, obj)

cache = _Redis()


    
    
    