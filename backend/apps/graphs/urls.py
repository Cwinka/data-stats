from config import app
from fastapi import Depends
from settings import Auth
from utils_ import ValidFilenamesOrHttpException

from models.files import FilePointer
from models.graph import BaseGraph
from models.users import BaseUser

from .hist import histogramm as hist
from .models import Histogramm, ScatterGraph, ScatterMatrix
from .routers import graph_router
from .scatter import scatter_matrix as scatt


async def use_graph(func, fp: FilePointer, settings: dict, user: BaseUser):
    """ Common function to execute any graph with settings. If no file, raise 404 error """
    ValidFilenamesOrHttpException([fp.filename])
    return await func(fp, settings, user)

@graph_router.post(f"/hist", response_model=Histogramm)
async def histogramm(fp: FilePointer, settings: BaseGraph, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """Creates a histogramm of the specified column"""
    return {'detail': await use_graph(hist, fp, settings, user)}

@graph_router.post(f"/scatter", response_model=ScatterMatrix)
async def scatter_matrix(fp: FilePointer, settings: ScatterGraph, user: BaseUser = Depends(Auth.getBaseUserIfTokenValid)):
    """Creates a scatter matrix of the specified column"""
    return {'detail': await use_graph(scatt, fp, settings, user)}

app.include_router(graph_router)
