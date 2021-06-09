import {

    FETCH_HISTOGRAMM,
    PUT_HISTOGRAMM,
    CLEAR_HISTOGRAMM,
    FETCH_SCATTER,
    PUT_SCATTER,
    CLEAR_SCATTER,
    CLEAR_GRAPH,
} from "./types";


const initial = {
    histogram: {graph: {}, shown:false, column: ""},
    scatter: {graph: {}, shown: false, x_col: "", y_col: ""}
}

export const graphReducer = (state=initial, action) => {
    switch(action.type){
        case PUT_HISTOGRAMM:
            return {...state, histogram: {graph: action.histogram, shown: false, column: action.column}}
        case PUT_SCATTER:
            return {...state, scatter: {graph: action.scatter, shown: false, x_col: action.x_col, y_col: action.y_col}}
        case CLEAR_HISTOGRAMM:
            return {...state, histogram: initial.histogram}
        case CLEAR_SCATTER:
            return {...state, scatter: initial.scatter}
        case CLEAR_GRAPH:
            return initial
        default:
            return state;
    }
}

export function fetch_histogramm(filename, column){
    return {type: FETCH_HISTOGRAMM, filename, column}
}
export function put_histogramm(histogram, column){
    return {type: PUT_HISTOGRAMM, histogram, column}
}
export function clear_histogramm(){ 
    return {type: CLEAR_HISTOGRAMM}
}

export function fetch_scatter(filename, x_col, y_col){
    return {type: FETCH_SCATTER, filename, x_col, y_col}
}
export function put_scatter(scatter, x_col, y_col){
    return {type: PUT_SCATTER, scatter, x_col, y_col}
}
export function clear_scatter(){
    return {type: CLEAR_SCATTER}
}

export function clear_graph(){
    return {type: CLEAR_GRAPH}
}