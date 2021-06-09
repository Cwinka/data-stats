from config import API_VER
from fastapi import APIRouter
from models.status import BadRequest, NotAuthorized, NotFound


common_responses = {
    400: {"model": BadRequest},
    401: {"model": NotAuthorized}
}
file_interract_resp = {
    **common_responses,
    404: {"model": NotFound}
}

user_router = APIRouter(
    prefix=f"/{API_VER}/users",
    tags=["users"],
    responses=common_responses,
)