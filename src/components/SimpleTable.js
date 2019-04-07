import React from 'react';

const SimpleTable = (props) => {
    return(
        <table border="1" id="simpleReactTable">
            <thead>
                <tr>
                    <th>incidentNumber</th>
                    {/* <th>description</th> */}
                    <th>date</th>
                    <th>status</th>
                    <th>class1</th>
                    <th>class2</th>
                    <th>class3</th>
                    <th>class4</th>
                    <th>branch</th>
                    <th>division</th>
                    <th>project</th>
                </tr>
            </thead>
            <tbody>
                {props.jdeData.map((data) => {
                    return(
                        <tr>
                            <td>{data.incidentNumber}</td>
                            {/* <td>{data.description}</td> */}
                            <td>{data.date}</td>
                            <td>{data.status}</td>
                            <td>{data.class1}</td>
                            <td>{data.class2}</td>
                            <td>{data.class3}</td>
                            <td>{data.class4}</td>
                            <td>{data.branch}</td>
                            <td>{data.division}</td>
                            <td>{data.project}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default SimpleTable;