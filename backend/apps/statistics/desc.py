import pandas as pd
from models.files import FilePointer
from models.users import BaseUser
from storages.userStore import UserStore


async def describe(user: BaseUser, fp: FilePointer):
    """ Returns described data"""
    source = await UserStore(user).fetch_file(fp.filename)
    df = pd.read_csv(source)
    result = df.describe()
    return result
