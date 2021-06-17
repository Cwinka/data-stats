from fastapi import APIRouter
from config import API_VER
from models.status import BadRequest, NotAuthorized, NotFound


common_responses = {
    400: {"model": BadRequest},
    401: {"model": NotAuthorized}
}
file_interract_resp = {
    **common_responses,
    404: {"model": NotFound}
}

ai_router = APIRouter(
    prefix=f"/{API_VER}/ai",
    tags=["simple ai algorithms"],
    responses=file_interract_resp
)