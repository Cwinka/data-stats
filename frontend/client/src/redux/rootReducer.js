import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { csvTableReducer } from "./csvTableReducer";
import { detailsReducer } from "./detailsReducer";
import { filesReducer } from "./filesReduces";
import { loaderReducer } from "./loaderReducer";

export const rootReducer = combineReducers({
    auth: authReducer,
    file_manager: filesReducer,
    csv_manager: csvTableReducer,
    loaders: loaderReducer,
    filedetails: detailsReducer,
})