import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { BarChart , Tooltip, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import service from "../../services/graphService"
import styles from "./graph.style.css";

function mStP(state) {
    return {
        filename: state.filedetails.filename,
        columns: state.csv_manager.numeric_cols,
    }
}

export const Histograms = connect(mStP)( React.memo( ({columns, filename}) => {
    const [hist, setHist] = useState([]);
    const [shown, setShown] = useState(false);
    const [activeCol, setActive] = useState("");

    useEffect(() => {
        setHist([]);
        setActive("");      
    }, [filename])

    async function get_histogramm(column){
        try {
            const response = await service.get_histogramm(filename, column);
            setHist(response.data.detail.hist);
            setActive(column);
        } catch (e){
            console.log(e);
        }
    }
    console.log("[HISTORGRAMMS] rendered");
    return <div className="details-block histogramms">
        <div className="spread-title">
            <h4 className="details-hading">Histograms</h4>
            <button className="btn btn-sm btn-outline-warning warn-button" onClick={() => setShown(!shown)}>{shown ? "Hide": "Show"}</button>
        </div>
        {shown && <>
            <ul>
            {columns && columns.map(column => (
                    <li>
                        <button className={"btn btn-sm" + (column === activeCol ? ` ${styles.focused}`: "")} onClick={() => get_histogramm(column)}>{column}</button>
                    </li>
                    ))
                }
            </ul>
            <SingleHist hist={hist}/>
        </>}
    </div>
}))

const SingleHist = React.memo( ({hist}) => {
    console.log("Single histogramm rendered");
    if (!hist.length) {
        return <></>
    }
    return <div className="chart">
            <BarChart width={730} height={250} data={hist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x_axis" />
                <YAxis dataKey="y_axis"  />
                <Tooltip />
                <Bar dataKey="y_axis" name="count" fill="#8884d8" />
            </BarChart>
        </div>
})