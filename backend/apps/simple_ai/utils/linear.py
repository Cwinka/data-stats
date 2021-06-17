
from models.users import BaseUser
from sklearn.linear_model import LinearRegression

from ..models import LinReg
from .common import BasePrepareOperations

class Linear(BasePrepareOperations):
    def __init__(self, user: BaseUser, settings: LinReg) -> None:
        super().__init__(user, settings)
        self.model = LinearRegression(normalize=True)

    async def trainThenGetWeightsAndScore(self) -> dict:
        data = await self.getFileAndApplyBaseSettings()

        x_train, x_test, y_train, y_test = self.split_for_x_y(data)
        self.model.fit(x_train, self._encoder.fit_transform(y_train))
        score = self.model.score(x_test, self._encoder.fit_transform(y_test))
        return {"weights": list(self.model.coef_), "score": score, **self.sanitize_report}
    

