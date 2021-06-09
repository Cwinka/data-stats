from functools import wraps
from fastapi import HTTPException


def catch_no_column(f):
    """ Catch all KeyError errors and raise HTTP execption 404. Only async func """
    @wraps(f)
    async def wrap(*a, **kw):
        try:
            return await f(*a, **kw)
        except KeyError as e:
            raise HTTPException(404, f"column {e} not found")
    return wrap