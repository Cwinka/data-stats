import {$python_api} from "../api";


export default class statisticService {

    static async get_csv_correlation(filename, column){
        return await $python_api.post('/stat/corr', {fp: {filename}, settings: {x_column: column}})
    }
    static async get_csv_stat_description(filename){
        return await $python_api.post('/stat/describe', {filename})
    }

}