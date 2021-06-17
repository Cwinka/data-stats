import React, { useEffect, useState } from "react"
import { connect, useDispatch } from 'react-redux';
import styles from "./table.style.css";
import {
    putOnlyNumericColumns,
    putAllCols,
} from '../../redux/csvTableReducer';
import fileService from "../../services/userFilesServise"


const mapStateToProps = (state) => {
    return {
        filename: state.filedetails.filename
    }
}
function get_only_numeric_cols(array){
    const cols = [];
    array[1].map((elem, i) => {
        if (!isNaN(+elem) && elem){ // not empty and numeric
            cols.push(array[0][i]);
        }
    })
    return cols
}

export const CsvTableWrapper = connect(mapStateToProps)( ({filename}) => {
    const dispatch = useDispatch();
    const [table, setTable] = useState([]);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        fileService.get_ten_rows(filename).then(response => {
            const table = response.data.detail;
            setTable(table);
            const cols = get_only_numeric_cols(table);
            dispatch(putOnlyNumericColumns(cols));
            dispatch(putAllCols(table[0]));
        }).catch(e => {
            
        })

    }, [filename])

    console.log("Csv table wrapper render");
    return <div className="details-block csv">
            <div className="spread-title">
                <h4>Part of data [:10]</h4>
                {table.length !== 0 && <button className="btn btn-sm btn-outline-warning warn-button" onClick={() => setShown(!shown)}>{shown ? "Hide": "Show"}</button>}
            </div>
        
            {shown && table.length !== 0 &&
                <div className={styles.wrapper_scr}>
                    <CsvTable table={table}/>
                </div>}
        </div>
})


const CsvTable = React.memo( ({table}) => {
    const head = table[0];
    const vals = table.slice(1,-1);

    console.log("Csv table render");
    return <>
        <table className="table table-sm">
            <thead className="thead-dark">
                {head.map(h_v => (
                    <th scope="col">
                        {h_v}
                    </th>
                ))}
            </thead>
            <tbody>
                {vals.map(line => (
                    <tr>
                        {line.map(val => (
                            <td>
                                {val}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </>
})