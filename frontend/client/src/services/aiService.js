import {$python_api} from "../api";


export class TreeConfig {
    constructor({filename, predict, test_size,
                fixed_random, max_depth, exclude_columns, train_only_columns}) {
        this.filename = filename;
        this.predict = predict;
        this.test_size = test_size;
        this.fixed_random = fixed_random;
        this.max_depth = max_depth;
        this.exclude_columns = exclude_columns;
        this.train_only_columns = train_only_columns;
    }
}
export class TreeResults {
    constructor({dropped, new_columns, predict_map, score, tree}) {
        this.dropped = dropped;
        this.new_columns = new_columns;
        this.predict_map = predict_map;
        this.score = score;
        this.tree = tree;
    }
}

export default class graphService {
    static async trainAndGetDecisionTree(config) {
        const json_conf = new TreeConfig(config);
        try{
            const response = await $python_api.post("/ai/tree", json_conf);
            return {result: new TreeResults(response.data.details)}
        } catch (e){
            return {error: e.response.data.detail}
        }
    }
}