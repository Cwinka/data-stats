import {
    PUT_NUMERIC_COLUMNS,
    PUT_ALL_COLUMNS,
} from "./types";


const initial = {
    numeric_cols: [],
    all_cols: []
}

export const csvTableReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_NUMERIC_COLUMNS:
            return {...state, numeric_cols: action.payload}
        case PUT_ALL_COLUMNS:
            return {...state, all_cols: action.payload}
        default:
            return state;
    }
}

export function putOnlyNumericColumns(columns) {
    return {type: PUT_NUMERIC_COLUMNS, payload: columns}
}
export function putAllCols(columns) {
    return {type: PUT_ALL_COLUMNS, payload: columns}
}