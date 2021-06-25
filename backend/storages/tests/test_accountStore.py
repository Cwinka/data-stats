
import sys, os
BASE_DIR = os.path.dirname(os.path.abspath(__name__))
sys.path.append(BASE_DIR)

from storages.globals.accountsStore import AccountsStore
from models.users import BaseUser
import asyncio

accounts = AccountsStore()

TEST_USER = BaseUser(
        dp="213sdvxv",
        email = "randomgoodname")


def test_get_user():
    user = asyncio.run(accounts.fetch_user(TEST_USER.email))

    assert user is None
