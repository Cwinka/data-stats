import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip } from 'recharts';
import service from "../../services/graphService"
import styles from "./graph.style.css";


function mStP(state) {
    return {
        filename: state.filedetails.filename,
        columns: state.csv_manager.numeric_cols,
    }
}

export const ScatterMatrix = connect(mStP)( React.memo( ({columns, filename}) => {
    const [x_col, setXcol] = useState("");
    const [y_col, setYcol] = useState("");
    const [labels, setLab] = useState([]);
    const [shown, setShown] = useState(false);
    const [scatter, setScatter] = useState([]);

    useEffect(() => {
        get_scatter();
    }, [x_col, y_col])
    
    useEffect(() => {
        setScatter([]);
        setLab([]);
        setXcol("");
        setYcol("");
    }, [filename])
    
    async function get_scatter(){
        if (x_col && y_col){
            try {
                const response = await service.get_scatter(filename, x_col, y_col);
                setLab([x_col, y_col]);
                setScatter(response.data.detail.scatter);
            } catch (e) {
                throw e;
            }
        }
    }
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
        setScatter([]);
        setLab([]);
    }

    console.log("[SCATTER] rendered");
    return columns.length >= 2 &&
            <>
                <div className="details-block scatters">
                    <div className="spread-title">
                        <h4>Scatter</h4>
                        <button className="btn btn-sm btn-outline-warning warn-button" onClick={() => setShown(!shown)}>{shown ? "Hide": "Show"}</button>
                    </div>
                    {shown && <>
                        <button className="btn btn-sm btn-warning" style={{margin: "0 5px"}} onClick={clearChoices}>Clear</button>
                        <p>Scatter rounds some values to lessen data size</p>
                        <ul>
                        {columns && columns.map(column => (
                                <li>
                                    <button className={"btn btn-sm" + (column === x_col || column === y_col? ` ${styles.focused}`: "")}
                                            onClick={() => setCol(column)}>
                                                {column}
                                    </button>
                                </li>
                                ))
                            }
                        </ul>
                        {scatter.length !== 0 && labels.length !==0 && <SingleScatter scat={scatter} labels={labels}/>}
                        </>
                    }
                </div>
            </>
}))


const SingleScatter = React.memo(({scat, labels}) => {

    const [x_col, y_col] = labels;
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
    console.log("[Single scatter] rendered");
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
                <ZAxis type="number" dataKey="density" range={[60, 400]} name="density"/>
                <Tooltip />
                <Scatter data={scat} fill="#8884d8" />
            </ScatterChart>
        </div>
})