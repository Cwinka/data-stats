import React, { useEffect } from "react"
import { connect, useDispatch } from 'react-redux';
import { putFilenameForDetails, clearFilenameForDetails } from "../../redux/detailsReducer";
import {CsvTableWrapper} from '../csvTable';
import { Histograms, ScatterMatrix } from "../graphs";
import { CSVDescription, Correlations } from "../csvdescription";
import { DesTree } from "../des-tree";
import styles from "./details.style.css"


const mapStateToProps = (state) => {
    return {
        filename: state.filedetails.filename
    }
}


export const FileDetails = connect(mapStateToProps)(({filename}) => {
    console.log("Details render");

    return <div className={styles.details}>
        {filename && <>
            <div className={styles.title}>
                <h3 className={styles.heading}>{filename}</h3>
                <DestroyDetailsButton btn_cls="btn btn-sm btn-danger"/>
            </div>
            <br />
            <CSVDescription/>
            <br />
            <Correlations/>
            <br />
            <CsvTableWrapper/>
            <br />
            <Histograms/>
            <br />
            <ScatterMatrix/>
            <br />
            <DesTree />
        </>}
    </div>
})

export const DisplayDetailsButton = ({btn_cls, fl_name}) => {
    const dispatch = useDispatch();
    function showDetails() {
        dispatch(putFilenameForDetails(fl_name))
    }
    return <>
        <button className={btn_cls} onClick={showDetails}>Show details</button>  
    </>
}

export const DestroyDetailsButton = ({btn_cls}) => {
    const dispatch = useDispatch();
    function destroyDetails() {
        dispatch(clearFilenameForDetails())
    }
    return <>
        <button className={btn_cls} onClick={destroyDetails}>Destroy details</button>  
    </>
}
