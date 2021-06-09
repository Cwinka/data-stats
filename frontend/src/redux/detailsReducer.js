import {

    PUT_FILENAME_FOR_DETAILS,
    CLEAR_FILENAME_FOR_DETAILS
} from "./types";


const initial = {
    filename: ""
}

export const detailsReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_FILENAME_FOR_DETAILS:
            return {...state, filename: action.payload}
        case CLEAR_FILENAME_FOR_DETAILS:
            return {...state, filename: ""}
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