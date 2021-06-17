import {
    LOGOUT_USER,
    PUT_AUTH_ERROR,
    ALLOW_ACCESS,
    RESTRICT_ACCESS,
    CLEAR_AUTH_ERROR
} from "./types";
import AuthService from "../services/authService";
import { clear_files, clear_space_used, fetch_files } from "./filesReduces";
import { $api } from "../api";
import { hidePageLoader, showPageLoader } from "./loaderReducer";

const initial = {
    username: "",
    error: "",
    access: false,
    user: {}
}

export const authReducer = (state=initial, action) => {
    switch(action.type){
        case ALLOW_ACCESS:
            return {access: true, username: action.user.email, user: action.user, error: ""}
        case RESTRICT_ACCESS:
            return initial
        case PUT_AUTH_ERROR:
            return {...state, error: action.payload}
        case CLEAR_AUTH_ERROR:
            return {...state, error: ""}
        case LOGOUT_USER:
            return initial
        default:
            return state;
    }
}

export function logIn(email, password) {
    return async dispatch =>  {
        try{
            const response = await AuthService.login(email, password);
            const {accessToken, user}  = response.data;
            dispatch(fetch_files());
            return dispatch(setAccessTokenAndAllowAccess(accessToken, user));
        } catch (e){
            dispatch(restrictAccess());
            return dispatch(putAuthError(e.response.data.message));
        }
    }
}
function setAccessTokenAndAllowAccess(accessToken, user) {
    localStorage.setItem('token', accessToken);
    return {type: ALLOW_ACCESS, user}
}
function restrictAccess() {
    return {type: RESTRICT_ACCESS}
}
function putAuthError(message) {
    return {type: PUT_AUTH_ERROR, payload: message}
}
export function registerUser(email, password) {
    return async dispatch =>  {
        try{
            const response = await AuthService.registration(email, password);
            const {accessToken, user}  = response.data;
            return dispatch(setAccessTokenAndAllowAccess(accessToken, user));
        } catch (e){
            dispatch(restrictAccess());
            return dispatch(putAuthError(e.response.data.message));
        }
    }
}
export function logOut() {
    return async dispatch => {
        await AuthService.logout();
        localStorage.removeItem('token');
        dispatch(clear_files());;
        dispatch(clear_space_used());
        return dispatch(restrictAccess());
    }
}

export function checkCred(){
    return async dispatch => {
        dispatch(showPageLoader());
        try{
            const response = await $api.get('/validate');
            const {user}  = response.data;
            dispatch(fetch_files());
            return dispatch({type: ALLOW_ACCESS, user})
        } catch (e){
            localStorage.removeItem('token');
        } finally {
            dispatch(hidePageLoader());
        }
    }
}
