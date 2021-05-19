import React from 'react'
import { useParams } from 'react-router'

function PatientPortal(){
    let {pEmail} = useParams();
    return (
    <div>
        <h1>Patient portal: {pEmail}</h1>
    </div>
    )
}

export default PatientPortal