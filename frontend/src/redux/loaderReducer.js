import {
    SHOW_PAGE_LOADER,
    HIDE_PAGE_LOADER 
} from "./types";


const initial = {
    shown: true,
}

export const loaderReducer = (state=initial, action) => {
    switch(action.type){
        case SHOW_PAGE_LOADER:
            return {...state, shown: true}
        case HIDE_PAGE_LOADER:
            return {...state, shown: false}
        default:
            return state;
    }
}

export function show_loader() {
    return {type: SHOW_PAGE_LOADER}
}
export function hide_loader() {
    return {type: HIDE_PAGE_LOADER}
}
