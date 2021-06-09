import random

from config import DIRNAME_LENGTH, app
from fastapi import Depends
from models.users import BaseUser, NewUser
from settings import Auth, Store

from .routers import user_router


@user_router.post(f"/new") # needs to implemented
async def create_new_user(new_user: NewUser = Depends(), admin: BaseUser = Depends(Auth.getAdminUserIfTokenValid)):
    """ Creates new user. Only for admin """
    dp = "".join(random.sample("QWERTYNMqwertyuiopazxcvbnm#$12345678901234567890", k=DIRNAME_LENGTH))
    psw = Auth.get_password_hash(new_user.password)
    new_user.setDPandPSW(dp, psw)
    user = await Store.accounts.create_user(new_user)
    return user.psw

app.include_router(user_router)
