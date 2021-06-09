import { put } from 'redux-saga/effects';
import { call, takeLatest } from 'redux-saga/effects'
import { FETCH_HISTOGRAMM, CLEAR_FILENAME_FOR_DETAILS, PUT_FILENAME_FOR_DETAILS, FETCH_SCATTER } from '../types';
import service from "../../services/graphService"
import { clear_graph, clear_histogramm, clear_scatter, put_histogramm, put_scatter } from '../graphReducer';


function* fetchHisthWoker(action) {
    const res = yield call(() =>
        service.get_histogramm(action.filename, action.column)
            .catch(err => {
                return {message: err.response.data.detail, status: err.response.status}
    }))
    if (res.detail) {
        yield put(put_histogramm(res.detail.hist, action.column))
    } else {
        yield put(clear_histogramm())
    }
}
function* fetchScatWoker(action) {
    const res = yield call(() =>
        service.get_scatter(action.filename, action.x_col, action.y_col)
            .catch(err => {
                return {message: err.response.data.detail, status: err.response.status}
    }))
    if (res.detail) {
        yield put(put_scatter(res.detail.scatter, action.x_col, action.y_col))
    } else {
        yield put(clear_scatter())
    }
}

function* clearGraphWorker(){
    yield put(clear_graph())
}

export function* graphSaga() {
    yield takeLatest(FETCH_HISTOGRAMM, fetchHisthWoker);
    yield takeLatest(FETCH_SCATTER, fetchScatWoker);
    yield takeLatest(CLEAR_FILENAME_FOR_DETAILS, clearGraphWorker);
    yield takeLatest(PUT_FILENAME_FOR_DETAILS, clearGraphWorker);
}