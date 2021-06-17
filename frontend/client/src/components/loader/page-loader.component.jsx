import React from "react"
import { connect } from "react-redux";
import styles from "./loader.style.css";


function mapStateToProps(state) {
    return {
        shown: state.loaders.page_loader_shown
    }
}


export const PageLoader = connect(mapStateToProps)(({shown, children}) => {
    console.log("[LOADER] rendered");
    return <>
        {shown ?
            <div className={styles.loader}>I'm loading c:</div>:
            children
        }
    </>
})