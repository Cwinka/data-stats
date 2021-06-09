import React from "react"
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {
        shown: state.loader.shown
    }
}


export const Loader = connect(mapStateToProps)(({shown, children}) => {
    console.log("Loader render");
    return <>
        {shown ?
            <div className="loader">I'm loading c:</div>:
            children
        }
    </>
})