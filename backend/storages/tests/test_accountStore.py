
import sys, os
BASE_DIR = os.path.dirname(os.path.abspath(__name__))
sys.path.append(BASE_DIR)

from models.users.forms import NewUser
from storages.globals.accountsStore import AccountsStore
from models.users.models import UserInDB
import asyncio

accounts = AccountsStore()

TEST_USER = NewUser(
        grant_type= None,
        username = "randomgoodname",
        password = "12",
        scope = "",
        full_name = None,
        email = None,
        is_ = False,
        client_id =None,
        client_secret = None)
TEST_USER.setDPandPSW(dp="TEST", psw="randomhashedpassword")


def test_get_user():
    user = asyncio.run(accounts.fetch_user(TEST_USER.username))
    assert type(user) == UserInDB
    assert user.dp == TEST_USER.dp
    assert user.username == TEST_USER.username