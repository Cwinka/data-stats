import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import service from "../../services/statisticService";
import styles from "./description.style.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ReferenceLine,
    CartesianGrid,
    Tooltip,
} from 'recharts';


function mStP(state) {
    return {
        filename: state.filedetails.filename,
        columns: state.csv_manager.numeric_cols,
    }
}

export const Correlations = connect(mStP)( React.memo( ({filename, columns}) => {
    const [corr, setHCorr] = useState({});
    const [activeCol, setCol] = useState("");
    const [shown, setShown] = useState(false);

    useEffect(() => {
        setHCorr([]);
        setCol("")
    }, [filename])

    async function get_corr(column){
        try {
            const response = await service.get_csv_correlation(filename, column);
            const corr = response.data.corr
            delete corr[column];
            setHCorr(response.data.corr);
            setCol(column);
        } catch (e){
            console.log(e);
        }
    }
    console.log("[CORRELATIONS] rendered");
    return <div className="details-block correlations">
        <div className="spread-title">
            <h4 className="details-hading">Correlations</h4>
            <button className="btn btn-sm btn-outline-warning warn-button" onClick={() => setShown(!shown)}>{shown ? "Hide": "Show"}</button>
        </div>
        {shown && <>
            <ul>
            {columns && columns.map(column => (
                <li>
                    <button className={"btn btn-sm" + (column === activeCol ? ` ${styles.focused}`: "")} onClick={() => get_corr(column)}>{column}</button>
                </li>
                ))
            }
            </ul>
            {Object.keys(corr).length !== 0 && <PrettyCorrelation corr={corr} />}
        </>}
    </div>
}))


const PrettyCorrelation = React.memo( ({corr}) => {
    const corr_array = [];
    for (const [key, value] of Object.entries(corr)) {
        corr_array.push({key, value});
    }
    return (
        <div className="correlation">
            <BarChart data={corr_array} width={730} height={250}>
                <XAxis dataKey="key" />
                <YAxis />
                <CartesianGrid strokeDasharray="2 2" />
                <ReferenceLine y={0} stroke="#000" />
                <Tooltip/>
                <Bar dataKey="value" name="impact" fill="#8884d8" />
            </BarChart>
        </div>
    )
})