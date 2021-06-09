import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { csvTableReducer } from "./csvTableReducer";
import { detailsReducer } from "./detailsReducer";
import { filesReducer } from "./filesReduces";
import { loaderReducer } from "./loaderReducer";
import { graphReducer } from "./graphReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    file_manager: filesReducer,
    csv_manager: csvTableReducer,
    loader: loaderReducer,
    filedetails: detailsReducer,
    graphs: graphReducer,
})  