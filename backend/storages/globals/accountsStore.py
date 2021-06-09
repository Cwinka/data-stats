from typing import Union
from models.users import UserInDB, NewUser


class AccountsStore:
    def __init__(self) -> None:
        self.db = {
            "johndoe": {
                "username": "johndoe",
                "dp": "TEST",
                "full_name": "John Doe",
                "email": "johndoe@example.com",
                "psw": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                "disabled": False,
                "is_": True,
            },
            "me" : {
                "username": "me",
                "dp": "asdi23nfo0dmiwej34",
                "full_name": "Ze prikol",
                "email": "nahoy@example.com",
                "psw": "$2b$12$rRLtcvJy8x/.YW9ToFdlR.q1lMZsWZRx2buTy813zfoH68jWQLD6a",
                "disabled": False,
                "is_": False,
            }
        }
    
    async def fetch_user(self, username:str) -> Union[UserInDB, None]:
        if username in self.db:
            return UserInDB(**self.db[username])
    
    async def create_user(self, new_user: NewUser) -> UserInDB:
        self.db[new_user.username] = new_user.as_dict
        return UserInDB(**new_user.as_dict)
    
    async def delete_user(self, username: str):
        self.db.pop(username)


