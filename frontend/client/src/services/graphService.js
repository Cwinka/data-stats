import {$python_api} from "../api";


export default class graphService {
    static async get_histogramm(filename, column){
        return await $python_api.post('/graph/hist', {fp: {filename}, settings: {x_column:column}})
    }
    static async get_scatter(filename, x_col, y_col){
        return await $python_api.post("/graph/scatter", {fp: {filename}, settings: {x_column:x_col, y_column: y_col}})
    }
}