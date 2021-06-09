import { put } from 'redux-saga/effects';
import { call, takeLatest } from 'redux-saga/effects'

import { NOT_CSV_FILE_MESSAGE } from "../../config"
import fileService from "../../services/userFilesServise"

import {
    FETCH_FILES,
    UPLOAD_FILE
} from '../types'
import {
    new_files,
    put_files,
    set_space_used,
    set_upl_message,
    update_space_used
} from '../filesReduces';


function* filesFetchWorker(){
    const files = yield call(() => fileService.get_uploaded_user_file())
    const space_usage = files.map(file => file.Size).reduce((a,b) => a+b, 0)
    if (files && files.length) {
        yield put(put_files(files))
        yield put(set_space_used(space_usage))
    }
}

function* fileUploadWorker(action) {
    const file_ = action.payload
    yield put(set_upl_message(`Uploading ${file_.name} ...`))
    const res = yield call(() => fileService.upload_file(file_).catch(err => {
        return {message: err.response.data.detail, status: err.response.status}
    }))
    if (res.filename){
        yield put(new_files([{filename: res.filename, Size: file_.size, LastModified: file_.lastModifiedDate}]))
        yield put(update_space_used(file_.size))
        yield put(set_upl_message(`${file_.name} has been uploaded`))
    } else {
        if (res.status === 400) {
            yield put(set_upl_message(NOT_CSV_FILE_MESSAGE))
        } else {
            yield put(set_upl_message(res.message))
        }
    }
}
export function* fetchFilesSaga() {
    yield takeLatest(FETCH_FILES, filesFetchWorker)
    yield takeLatest(UPLOAD_FILE, fileUploadWorker)
}