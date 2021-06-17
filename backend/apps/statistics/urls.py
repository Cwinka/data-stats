from config import app
from fastapi import Depends
from models.files import FilePointer
from models.graph import BaseGraph
from models.users import BaseUser
from settings import Auth
from utils_ import ValidFilenamesOrHttpException

from .corr import correlation as corr
from .desc import describe as describ
from .routers import statistic_router


@statistic_router.post(f"/corr")
async def correlation(fp: FilePointer, settings: BaseGraph, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    ValidFilenamesOrHttpException([fp.filename])
    res = await corr(user, fp, settings)
    return {'corr': res}

@statistic_router.post(f"/describe")
async def describe(fp: FilePointer, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    ValidFilenamesOrHttpException([fp.filename])
    res = await describ(user, fp)
    return {'descr': res}

app.include_router(statistic_router)
