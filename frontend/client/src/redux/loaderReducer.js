import {
    SHOW_PAGE_LOADER,
    HIDE_PAGE_LOADER 
} from "./types";


const initial = {
    page_loader_shown: true, // must be true, otherwise trigger second render if initial true
}

export const loaderReducer = (state=initial, action) => {
    switch(action.type){
        case SHOW_PAGE_LOADER:
            return {page_loader_shown: true}
        case HIDE_PAGE_LOADER:
            return {page_loader_shown: false}
        default:
            return state;
    }
}

export function showPageLoader() {
    return {type: SHOW_PAGE_LOADER}
}
export function hidePageLoader() {
    return {type: HIDE_PAGE_LOADER}
}
