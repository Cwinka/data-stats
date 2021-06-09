from .accountsStore import AccountsStore
from .fileStore import Files

class _Storage:
    def __init__(self) -> None:
        self.files = Files()
        self.accounts = AccountsStore()
