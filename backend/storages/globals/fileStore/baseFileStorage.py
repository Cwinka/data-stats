from models.users import BaseUser
from typing import Tuple, List, IO

class BaseFileStorage:
    async def free_space_left(self, user: BaseUser) -> Tuple[float, float]:
        """ Returns available user space in bytes """
        raise NotImplementedError

    async def files_list(self, user: BaseUser) -> List[str]:
        """ Returns the user uploaded files list """
        raise NotImplementedError

    async def upload(self, user: BaseUser, file:IO, filename:str) -> str:
        """ Upload the file to the cloud service """
        raise NotImplementedError
        
    async def exists(self, user: BaseUser, filename:str) -> bool:
        raise NotImplementedError

    async def get_file(self, user: BaseUser, filename:str) -> Tuple[str, bytes]:
        raise NotImplementedError

    async def delete(self, user: BaseUser, filename:str) -> str:
        raise NotImplementedError