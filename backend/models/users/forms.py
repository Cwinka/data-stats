from typing import Optional
from fastapi import Form
from loguru import logger


class NewUser:
    """ This is a dependency class, use it like:

        @app.post("/login")
        def login(form_data: NewUser = Depends()):
            print(form_data.username)
            print(form_data.password)
    """
    inout_fileds = ['password', 'client_id', 'client_secret', 'grant_type', 'scopes']

    def __init__(
        self,
        grant_type: str = Form(None, regex="password"),
        username: str = Form(..., description="User login"),
        password: str = Form(...),
        scope: str = Form(""),
        full_name: Optional[str] = Form("", description="Full name of a user"),
        email: Optional[str] = Form("", description="User email"),
        is_: Optional[bool] = Form(False, description="User is a moder or not"),
        client_id: Optional[str] = Form(None),
        client_secret: Optional[str] = Form(None),
    ):
        self.grant_type = grant_type
        self.username = username
        self.password = password
        self.full_name = full_name
        self.email = email
        self.is_ = is_
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret

    def setDPandPSW(self, dp:str, psw:str) -> None:
        self.dp = dp
        self.psw = psw

    @property
    def as_dict(self) -> dict:
        to_out = self.__dict__.copy()
        for fl in self.inout_fileds:
            try:
                del to_out[fl]
            except KeyError:
                logger.error(f'No such property "{fl}" in {self.__class__.__name__}')
        return to_out
