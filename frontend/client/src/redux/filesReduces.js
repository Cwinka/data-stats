import {
    NEW_FILES,
    DELETE_FILE,
    CLEAR_FILES,
    PUT_FILES,
    SET_SPACE_USAGE,
    UPDATE_SPACE_USAGE,
    CLEAR_SPACE_USAGE,
    SET_UPL_MESSAGE,
} from "./types";
import fileService from "../services/userFilesServise"
import { ifShownDeletedClearDetails } from "./detailsReducer";

const initial = {
    files: [],
    space_used: 0,
    upload_status_message: ""
}

export const filesReducer = (state=initial, action) => {
    const all_files = state.files;
    switch(action.type){
        case PUT_FILES:
            return {...state, files: action.payload}
        case NEW_FILES:
            return {...state, files: [...all_files, ...action.payload]}
        case SET_UPL_MESSAGE:
            return {...state, upload_status_message: action.message}
        case DELETE_FILE:
            return {...state, files: all_files.filter(meta => meta.filename !== action.filename)}
        case CLEAR_FILES:
            return {...state, files: []}
        case UPDATE_SPACE_USAGE:
            const updated = state.space_used + action.payload
            return {...state, space_used: updated}
        case SET_SPACE_USAGE:
            return {...state, space_used: action.payload}
        case CLEAR_SPACE_USAGE:
            return {...state, space_used: 0}
        default:
            return state;
    }
}

export function upload_file(file_){
    return async dispatch => {
        dispatch(set_upl_message(`Uploading ${file_.name} ...`));
        try{
            const response = await fileService.upload_file(file_);
            const {filename} = response.data;
            if (filename){
                dispatch(new_files([
                    {filename: filename, Size: file_.size, LastModified: file_.lastModifiedDate}
                ]))
                dispatch(update_space_used(file_.size));
                dispatch(set_upl_message(`${file_.name} has been uploaded`));
            }
        } catch (e){
            throw e
        }
    }
}
export function new_files(filenames) {
    return {type: NEW_FILES, payload: filenames}
}
export function fetch_files() {
    return async dispatch => {
        const response = await fileService.get_uploaded_user_files();
        const files = response.data.detail.files;
        if (files && files.length) {   
            const space_usage = files.map(file => file.Size).reduce((a,b) => a+b, 0);
            dispatch(set_space_used(space_usage));
            return dispatch(put_files(files));
        }
    }
}
export function set_upl_message(message){
    return {type: SET_UPL_MESSAGE, message}
}
export function put_files(files) {
    return {type: PUT_FILES, payload: files}
}
export function del_file(filename) {
    return dispatch => {
        dispatch(ifShownDeletedClearDetails(filename));
        return dispatch({type: DELETE_FILE, filename});
    }
}
export function clear_files() {
    return {type: CLEAR_FILES}
}
export function update_space_used(size){
    return {type: UPDATE_SPACE_USAGE, payload: size}
}  
export function set_space_used(bytes){
    return {type: SET_SPACE_USAGE, payload: bytes}
}
export function clear_space_used() {
    return {type: CLEAR_SPACE_USAGE,}
}
