import React from "react"
import { connect, useDispatch } from "react-redux"
import { fetch_histogramm } from "../../redux/graphReducer";
import { BarChart , Tooltip, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';

function mStP(state) {
    return {
        columns: state.csv_manager.numeric_cols,
        filename: state.filedetails.filename,
        active_col: state.graphs.histogram.column,
    }
}

export const Histograms = connect(mStP)(({columns, filename, active_col}) => {
    const dispatch = useDispatch();
    console.log("Histograms rendered");

    function get_histogramm(column){
        dispatch(fetch_histogramm(filename, column))
    }
    return <div className="histograms">
        <span>Histograms</span>
        <ul>
        {columns && columns.map(column => (
                <li>
                    <button className={"btn btn-sm" + (column === active_col ? " focused": "")} onClick={() => get_histogramm(column)}>{column}</button>
                </li>
                ))
            }
        </ul>
        <SingleHist/>
    </div>
})

function mStP2(state) {
    return {
        hist: state.graphs.histogram.graph,
    }
}
const SingleHist = connect(mStP2)(({hist}) => {
    console.log("Single histogramm rendered");
    if (!Object.keys(hist).length) {
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