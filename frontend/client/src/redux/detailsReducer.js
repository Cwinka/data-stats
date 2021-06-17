import {
    PUT_FILENAME_FOR_DETAILS,
    CLEAR_FILENAME_FOR_DETAILS,
    FILE_WAS_DELETED
} from "./types";


const initial = {
    filename: "",
    prev: ""
}

export const detailsReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_FILENAME_FOR_DETAILS:
            const temp = state.filename
            return {filename: action.payload, prev: temp}
        case CLEAR_FILENAME_FOR_DETAILS:
            return {...state, filename: ""}
        case FILE_WAS_DELETED:
            const isShowDeleted = state.filename === action.filename
            return {...state, filename: isShowDeleted ? "" : state.filename}
        default:
            return state;
    }
}   

export function putFilenameForDetails(filename){
    return {type: PUT_FILENAME_FOR_DETAILS, payload: filename}
}
export function clearFilenameForDetails(){
    return {type: CLEAR_FILENAME_FOR_DETAILS}
}
export function ifShownDeletedClearDetails(filename){
    return {type: FILE_WAS_DELETED, filename}
}