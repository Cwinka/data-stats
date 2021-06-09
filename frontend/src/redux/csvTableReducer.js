import {
    PUT_CSV_TABLE,
    CLEAR_CSV_TABLE,
    HIDE_CSV_TABLE,
    SHOW_CSV_TABLE,
    PUT_NUMERIC_COLUMNS,
} from "./types";


const initial = {
    table: [],
    shown: false,
    filename: "",
    numeric_cols: []
}

export const csvTableReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_CSV_TABLE:
            return {...state, table: action.payload.table, filename: action.payload.filename}
        case CLEAR_CSV_TABLE:
            return initial
        case HIDE_CSV_TABLE:
            return {...state, shown: action.payload}
        case SHOW_CSV_TABLE:
            return {...state, shown: action.payload}
        case PUT_NUMERIC_COLUMNS:
            return {...state, numeric_cols: action.payload}
        default:
            return state;
    }
}   
/**
 * @param {Array} table Array must contains header row in 0 index
 */
export function puCsvtTable(table, filename) {
    return {type: PUT_CSV_TABLE, payload: {table, filename}}
}
export function putOnlyNumericColumns(columns) {
    return {type: PUT_NUMERIC_COLUMNS, payload: columns}
}
export function showCsvTable() {
    return {type: SHOW_CSV_TABLE, payload: true}
}
export function hideCsvTable() {
    return {type: HIDE_CSV_TABLE, payload: false}
}
export function clearCsvTable(){
    return {type: CLEAR_CSV_TABLE}
}