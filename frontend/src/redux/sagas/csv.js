import { put } from 'redux-saga/effects';
import { call, takeLatest } from 'redux-saga/effects'

import fileService from "../../services/userFilesServise"
import {
    clearCsvTable,
    puCsvtTable,
    putOnlyNumericColumns,
} from '../csvTableReducer';
import {
    CLEAR_FILENAME_FOR_DETAILS,
    PUT_FILENAME_FOR_DETAILS,
} from '../types'

function* csvFilenameChangeWoker(action) {
    const filename = action.payload;
    const res = yield call(() => fileService.get_ten_rows(filename));
    yield put(puCsvtTable(res, filename));
    const cols = get_only_numeric_cols(res);
    yield put(putOnlyNumericColumns(cols))
}
function* csvFileClearWoker() {
    yield put(clearCsvTable());
}

export function* csvTableSaga() {
    yield takeLatest(PUT_FILENAME_FOR_DETAILS, csvFilenameChangeWoker);
    yield takeLatest(CLEAR_FILENAME_FOR_DETAILS, csvFileClearWoker);
}


function get_only_numeric_cols(array){
    let cols = [];
    for (let i = 0; i < array.length; i++) {

        if (!isNaN(+array[1][i]) && array[1][i]){ // no empty vals and only numbers
            cols.push(array[0][i])
        }
    }
    return cols
}