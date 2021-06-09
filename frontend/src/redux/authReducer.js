import {
    LOG_USER,
    LOGOUT_USER,
    LOG_USER_CRED,
    PUT_USER,
    PUT_AUTH_ERROR,
    ALLOW_ACCESS,
    RESTRICT_ACCESS,
    CLEAR_AUTH_ERROR
} from "./types";


const initial = {
    username: "",
    error: "",
    access: false
}

export const authReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_USER:
            return {...state, username: action.payload}
        case ALLOW_ACCESS:
            return {...state, access: true}
        case RESTRICT_ACCESS:
            return {...state, access: false}
        case PUT_AUTH_ERROR:
            return {...state, error: action.payload}
        case CLEAR_AUTH_ERROR:
            return {...state, error: ""}
        case LOGOUT_USER:
            return {...state, username: ""}
        default:
            return state;
    }
}
export function allowAccess() {
    return {type: ALLOW_ACCESS}
}
export function restrictAccess() {
    return {type: RESTRICT_ACCESS}
}
export function putUser(username) {
    return {type: PUT_USER, payload: username}
}
export function putAuthError(message) {
    return {type: PUT_AUTH_ERROR, payload: message}
}
export function clearAuthError() {
    return {type: CLEAR_AUTH_ERROR}
}
export function logIn(username, password) {
    return {type: LOG_USER, payload: {username, password}}
}
export function logInWithCred() {
    return {type: LOG_USER_CRED}
}
export function logOut() {
    return {type: LOGOUT_USER}
}

