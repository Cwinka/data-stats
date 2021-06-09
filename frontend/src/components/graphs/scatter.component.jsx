import React, { useState } from "react"
import { connect, useDispatch } from "react-redux"
import { clear_scatter, fetch_scatter } from "../../redux/graphReducer";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function mStP(state) {
    return {
        filename: state.filedetails.filename,
        columns: state.csv_manager.numeric_cols,
    }
}

export const ScatterMatrix = connect(mStP)(({columns, filename}) => {
    const [x_col, setXcol] = useState("");
    const [y_col, setYcol] = useState("");
    console.log("Scatter rendered");
    const dispatch = useDispatch();
    function get_scatter(){
        if (x_col && y_col){
            dispatch(fetch_scatter(filename, x_col, y_col))
        }
    }
    get_scatter()

    function setCol(col){
        if (!x_col){
            setXcol(col);
        } else if (!y_col) {
            setYcol(col);
        } else if (x_col === col) {
            setXcol("");
        } else if (y_col === col) {
            setYcol("")
        }
        
    }
    function clearChoices(){
        setXcol("");
        setYcol("");
        dispatch(clear_scatter());
    }
    if (columns.length < 2){
        return <></>
    }
    
    return <div className="scatters">
        <span>Scatter</span>
        <button className="btn btn-sm" style={{margin: "0 5px"}} onClick={clearChoices}>Clear</button>
        <p>Scatter rounds some values to lessen data size</p>
        <ul>
        {columns && columns.map(column => (
                <li>
                    <button className={"btn btn-sm" + (column === x_col || column === y_col? " focused": "")}
                            onClick={() => setCol(column)}>
                                {column}
                    </button>
                </li>
                ))
            }
        </ul>
        <SingleScatter/>
    </div>
})

function mStP2(state) {
    return {
        scat: state.graphs.scatter.graph,
        x_col: state.graphs.scatter.x_col,
        y_col: state.graphs.scatter.y_col,
    }
}
const SingleScatter = connect(mStP2)(({scat, x_col, y_col}) => {
    console.log("Single scatter rendered");
    
    if (!Object.keys(scat).length) {
        return <></>
    }

    function minus_percent(num, percent){
        const fl = parseFloat(num)
        return fl - (fl*percent/100)
    }
    function plus_percent(num, percent){
        const fl = parseFloat(num)
        return fl + (fl*percent/100)
    }
    function roundTick(value){
        const fl = parseFloat(value)
        return fl.toFixed(2);
    }
    return <div className="chart">
            <ScatterChart width={900} height={350}> 
                <CartesianGrid/>
                <XAxis type="number" dataKey="x"
                    label={{ value: x_col, position: 'insideBottom', offset: 0 }}
                    domain={[dataMin => minus_percent(dataMin, 40),
                            dataMax => plus_percent(dataMax, 10)]}
                    name={x_col}
                    tickFormatter={roundTick}/>
                <YAxis type="number" dataKey="y"
                    label={{ value: y_col, angle: -90, position: 'insideLeft' }}
                    domain={[dataMin => minus_percent(dataMin, 50),
                            dataMax => plus_percent(dataMax, 10)]}
                    name={y_col}/>
                <Tooltip />
                <Scatter data={scat} fill="#8884d8" />
            </ScatterChart>
        </div>
})