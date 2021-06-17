from utils_.safe_names import ValidFilenamesOrHttpException
from models.users.models import BaseUser
from settings import Auth
from fastapi.param_functions import Depends
from config import app
from .router import ai_router
from .models import LinReg, DesTree
from .utils import Linear, DecisionTree

@ai_router.post(f"/linear")
async def histogramm(settings: LinReg, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """Creates a histogramm of the specified column"""
    ValidFilenamesOrHttpException([settings.filename])
    return {"details": await Linear(user, settings).trainThenGetWeightsAndScore()}

@ai_router.post(f"/tree")
async def histogramm(settings: DesTree, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """Creates a histogramm of the specified column"""
    ValidFilenamesOrHttpException([settings.filename])
    return {"details": await DecisionTree(user, settings).trainThenGetTreeAndScore()}


app.include_router(ai_router)