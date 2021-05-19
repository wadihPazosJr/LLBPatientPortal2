import React from 'react'
import { useParams } from 'react-router'

function PatientPortal(){
    let patientEmail = useParams();
    return (
    <div>
        <h1>Patient portal: {patientEmail}</h1>
    </div>
    )
}

export default PatientPortal