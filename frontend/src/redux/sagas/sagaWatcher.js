import { all, fork, } from 'redux-saga/effects'
import {fetchFilesSaga} from "./files"
import {csvTableSaga} from "./csv"
import {graphSaga} from "./graphs"
import {loginSaga} from "./login"

export default function* rootSaga(){
    yield all(
            [
                fork(loginSaga),
                fork(csvTableSaga),
                fork(fetchFilesSaga),
                fork(graphSaga)
            ]
        )
}