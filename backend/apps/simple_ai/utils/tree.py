import pandas as pd
from fastapi import HTTPException
from models.users import BaseUser
from sklearn.tree import DecisionTreeClassifier

import numpy as np

from ..models import DesTree
from .common import BasePrepareOperations


class DecisionTree(BasePrepareOperations):
    def __init__(self, user: BaseUser, settings: DesTree) -> None:
        super().__init__(user, settings)
        self.model = DecisionTreeClassifier(max_depth=settings.max_depth)

    async def trainThenGetTreeAndScore(self) -> dict:
        data = await self.getFileAndApplyBaseSettings()
        x_train, x_test, y_train, y_test = self.split_for_x_y(data)
        self._train_model_on(x_train, y_train)
        return {"tree": self._tree_in_list(),
                "score": self._get_score_on(x_test, y_test),
                **self.sanitize_report}

    def _train_model_on(self, x_train: np.ndarray, y_train: np.ndarray):
        self.model.fit(x_train, self._encoder.fit_transform(y_train))

    def _get_score_on(self, x_test: np.ndarray, y_test: np.ndarray) -> float:
        return self.model.score(x_test, self._encoder.fit_transform(y_test))
    
    def _tree_in_list(self):
        n_nodes = self.model.tree_.node_count
        children_left = self.model.tree_.children_left
        children_right = self.model.tree_.children_right
        feature = self.model.tree_.feature
        threshold = self.model.tree_.threshold

        node_depth = np.zeros(shape=n_nodes, dtype=np.int64)
        is_leaves = np.zeros(shape=n_nodes, dtype=bool)
        stack = [(0, 0)]  # start with the root node id (0) and its depth (0)
        while len(stack) > 0:
            # `pop` ensures each node is only visited once
            node_id, depth = stack.pop()
            node_depth[node_id] = depth

            # If the left and right child of a node is not the same we have a split
            # node
            is_split_node = children_left[node_id] != children_right[node_id]
            # If a split node, append left and right children and depth to `stack`
            # so we can loop through them
            if is_split_node:
                stack.append((children_left[node_id], depth + 1))
                stack.append((children_right[node_id], depth + 1))
            else:
                is_leaves[node_id] = True

        tree = []
        for i in range(n_nodes):
            if is_leaves[i]:
                tree.append("{space}node={node} is a leaf node.".format(
                    space=node_depth[i] * "\t", node=i))
            else:
                tree.append("{space}node[{node}] is a split node: "
                    "X[{feature}] <= {threshold} ? to node[{left}] : "
                    "to node[{right}].".format(
                        space=node_depth[i] * "\t",
                        node=i,
                        left=children_left[i],
                        feature=feature[i],
                        threshold=threshold[i],
                        right=children_right[i]))
        return tree
    
    def getValidSettingOrHTTPException(self, settings: DesTree) -> DesTree:
        if settings.max_depth < 1 or settings.max_depth > 10:
            raise HTTPException(400, "Max depth must be in interval [1; 10]")
        return super().getValidSettingOrHTTPException(settings)