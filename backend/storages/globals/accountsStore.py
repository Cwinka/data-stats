from models.users import BaseUser
from typing import Union

from config import DB_URL
from pymongo import MongoClient
from pymongo.errors import ConfigurationError
from loguru import logger

class AccountsStore:
    def __init__(self) -> None:
        try:
            self.cluster = MongoClient(DB_URL)
            self.users_cl = self.cluster['myFirstDatabase']['users']
            logger.warning("[MONGO] Connection established")
        except ConfigurationError as e:
            raise ConfigurationError(e)
    
    async def fetch_user(self, email:str) -> Union[BaseUser, None]:
        user = self.users_cl.find_one({'email': email})
        if user: 
            return BaseUser(**user)
        
        


