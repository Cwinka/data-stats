import React from "react"
import { connect, useDispatch } from 'react-redux';

import {
    hideCsvTable,
    showCsvTable
} from '../../redux/csvTableReducer';

const mapStateToProps = (state) => {
    return {
        shown: state.csv_manager.shown,
        table: state.csv_manager.table,
    }
}

export const CsvTableWrapper = connect(mapStateToProps)(({shown, table}) => {
    const dispatch = useDispatch();

    function showHideTable() {
        if (shown) {
            dispatch(hideCsvTable())
        } else {
            dispatch(showCsvTable())
        }
    }
    console.log("Csv table wrapper render");
    return <>
        {table.length !== 0 && <button className="btn btn-sm" onClick={showHideTable}>{shown ? "Hide table": "Show table"}</button>}
        {shown && table.length !== 0 &&
            <div className="csv-wrapper">
                <CsvTable table={table}/>
            </div>}
    </>
})


const CsvTable = ({table}) => {
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
                <th>

                </th>
            </thead>
            <tbody>
                {vals.map(line => {
                    return <>
                        <tr>
                            {line.map(val => (
                                <td>
                                    {val}
                                </td>
                            ))}
                        </tr>
                    </>
                })}
            </tbody>
        </table>
    </>
}