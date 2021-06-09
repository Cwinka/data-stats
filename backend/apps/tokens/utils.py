from config import FIELDS_IN_TOKEN
from models.users import UserInDB
from settings import Auth


def form_data(user: UserInDB) -> dict:
    """ Cretes a data which will be inject in access token """
    data = {}
    for fl in FIELDS_IN_TOKEN:
        value = user.__dict__.get(fl)
        if value:
            data[fl] = value
    data["sub"] = user.username
    return data

async def get_access_token(user: UserInDB) -> str:
    data = form_data(user)
    return await Auth.create_access_token(data)

