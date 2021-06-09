import {
    NEW_FILES,
    DELETE_FILE,
    FETCH_FILES,
    CLEAR_FILES,
    PUT_FILES,
    SET_SPACE_USAGE,
    UPDATE_SPACE_USAGE,
    CLEAR_SPACE_USAGE,
    UPLOAD_FILE,
    SET_UPL_MESSAGE,
} from "./types";


const initial = {
    files: [],
    space_used: 0,
    upl_message: "Drop a csv file or",
}

export const filesReducer = (state=initial, action) => {
    const all_files = state.files;
    switch(action.type){
        case PUT_FILES:
            return {...state, files: action.payload}
        case SET_UPL_MESSAGE:
            return {...state, upl_message: action.payload}
        case NEW_FILES:
            return {...state, files: [...all_files, ...action.payload]}
        case DELETE_FILE:
            return {...state, files: all_files.filter(meta => meta.filename !== action.payload)}
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
export function set_upl_message(message){
    return {type: SET_UPL_MESSAGE, payload: message}
}
export function upload_file(file_){
    return {type: UPLOAD_FILE, payload: file_}
}
export function new_files(filenames) {
    return {type: NEW_FILES, payload: filenames}
}
export function fetch_files() {
    return {type: FETCH_FILES}
}
export function put_files(files) {
    return {type: PUT_FILES, payload: files}
}
export function del_file(filename) {
    return {type: DELETE_FILE, payload: filename}
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
