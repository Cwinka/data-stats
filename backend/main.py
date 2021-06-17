
from config import app
from settings import *
from apps.cloud_files import urls
from apps.graphs import urls
from apps.statistics import urls
from apps.simple_ai import urls

from models.users.models import BaseUser
from fastapi import Depends
from settings import Auth
from storages.userStore import UserStore

@app.get("/user/info")
async def user_info(user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    used, total = await UserStore(user).free_space_left()
    return {"detail": {"used": used, "total": total}}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)