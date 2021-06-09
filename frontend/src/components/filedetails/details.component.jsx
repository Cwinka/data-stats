import React from "react"
import { connect, useDispatch } from 'react-redux';
import { putFilenameForDetails, clearFilenameForDetails } from "../../redux/detailsReducer";
import {CsvTableWrapper} from '../csvTable';
import { Histograms, ScatterMatrix } from "../graphs";

const mapStateToProps = (state) => {
    return {
        filename: state.filedetails.filename
    }
}


export const FileDetails = connect(mapStateToProps)(({filename}) => {
    console.log("Details render");

    return <div className="details">
        {filename && <>
            <h3>{filename}</h3>
            <CsvTableWrapper/>
            <Histograms/>
            <ScatterMatrix/>
            <DestroyDetailsButton btn_cls="btn btn-sm display__destroy-btn"/>
        </>}
    </div>
})

export const DisplayDetailsButton = ({btn_cls, fl_name}) => {
    const dispatch = useDispatch();
    function showDetails() {
        dispatch(putFilenameForDetails(fl_name))
    }
    console.log("Display details button render");
    return <>
        <button className={btn_cls} onClick={showDetails}>Show details</button>  
    </>
}

export const DestroyDetailsButton = ({btn_cls}) => {
    const dispatch = useDispatch();
    function destroyDetails() {
        dispatch(clearFilenameForDetails())
    }
    console.log("Destroy details button render");
    return <>
        <button className={btn_cls} onClick={destroyDetails}>Destroy details</button>  
    </>
}
