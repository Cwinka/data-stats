import pandas as pd
from models.files import FilePointer
from models.graph import BaseGraph
from models.users import BaseUser
from storages.userStore import UserStore

from .utils import catch_no_column


@catch_no_column
async def correlation(user: BaseUser, fp: FilePointer, sett: BaseGraph):
    source = await UserStore(user).fetch_file(fp.filename)
    df = pd.read_csv(source)
    corr = {k: v for k, v in sorted(df.corr()[sett.x_column].items(),
                                    key=lambda x: abs(x[1]))}
    return corr
