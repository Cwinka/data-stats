
from config import app
from settings import *
from apps.users import urls
from apps.tokens import urls
from apps.cloud_files import urls
from apps.graphs import urls
from apps.statistics import urls

from fastapi import Depends

@app.get("/hello")
async def hello(user = Depends(Auth.getBaseUserIfTokenValid)):
    return "Hi honey"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)