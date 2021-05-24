import React from 'react'
import { useParams } from 'react-router'

function PatientPortal(){
    let {parentId} = useParams();
    return (
    <div>
        <h1>Patient portal: {parentId}</h1>
    </div>
    )
}

export default PatientPortal