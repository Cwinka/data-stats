import { takeEvery, call, put } from 'redux-saga/effects'

import { clear_files, clear_space_used } from '../filesReduces';
import { logOut, putAuthError, putUser } from '../authReducer';
import {LOGOUT_USER, LOG_USER, LOG_USER_CRED} from '../types'
import authService from "../../services/authService";
import {
    allowAccess,
    clearAuthError,
    restrictAccess
} from '../authReducer';
import { hide_loader } from '../loaderReducer';


function* sagaLogOutWorker() {
    authService.logMeOut()
    yield put(clear_files()); // trigger update in userFiles
    yield put(restrictAccess())
    yield put(clear_space_used())
}

function* sagaLogInWithCredWorker() {
    const res = yield call(() => authService.sayHi())
    if (res.status === 200 ){
        const username = authService.getUserName()
        yield put(putUser(username))
        yield put(allowAccess())
    } else {
        yield put(logOut())
    }
    yield put(hide_loader())
}
function* logInWorker(action) {
    const {username, password} = action.payload;
    const res = yield call(() => authService.logMe(username, password));
    if (res.status === 200){
        yield put(clearAuthError())
        yield put(putUser(username))
        yield put(allowAccess())
    } else {
        yield put(putAuthError(res.message))
        yield put(restrictAccess())
    }
}
export function* loginSaga() {
    yield takeEvery(LOG_USER, logInWorker);
    yield takeEvery(LOG_USER_CRED, sagaLogInWithCredWorker);
    yield takeEvery(LOGOUT_USER, sagaLogOutWorker);
}