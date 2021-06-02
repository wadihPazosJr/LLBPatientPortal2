import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";
import LLBService from "./Components/LLBService";
import PatientInfo from "./Components/PatientInfo";

function SocialWorkerPatients() {
  let { socialWorkerId } = useParams();

  let [state, setState] = useState("Loading");

  useEffect(() => {
    const getPatients = () => {
      /* /constituent/socialWorker/patients?id=${socialWorkerId} */
      fetch(`/constituent/socialWorker/patients?id=${socialWorkerId}`)
        .then((res) => res.json())
        .then((res) => {
          /* patient: {
              id: patient.id,
              address: {id: patient.address.id, value: `${patient.address.address_lines}, ${patient.address.city}, ${patient.address.state}, ${patient.address.country}`},
              postal_code: patient.address.postal_code,
              birthdate: `${patient.birthdate.m}/${patient.birthdate.d}/${patient.birthdate.y}`,
              first: patient.first,
              last: patient.last,
              diagnosis: {id: res.patientDiagnosis.id, value: res.patientDiagnosis.value},
              hospital: res.hospital,
            }, */

          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            const responsePatientArray = res.patients;

            const patientArr = [];

            responsePatientArray.forEach((patient) => {
              patientArr.push({
                id: patient.id,
                address: {
                  id: patient.address.id,
                  value: `${patient.address.address_lines}, ${patient.address.city}, ${patient.address.state}, ${patient.address.country}`,
                },
                postal_code: patient.address.postal_code,
                birthdate: `${patient.birthdate.m}/${patient.birthdate.d}/${patient.birthdate.y}`,
                first: patient.first,
                last: patient.last,
                diagnosis: patient.diagnosis,
                hospital: patient.hospital,
                socialWorker: patient.socialWorker,
              });
            });

            setState({ patients: patientArr });
          }
        });
    };

    getPatients();
  }, [socialWorkerId]);

  return (
    <div>
      <h1>Patients Page</h1>
      <br />
      <br />
      <Link to={`/s-portal/${socialWorkerId}`}>Your Info</Link>
      <br />
      <br />
      <Link to={`/s-portal/${socialWorkerId}/patients`}>Patients</Link>
      <br />
      <br />
      <div>
        <h1>Patients: </h1>
        <ul>
          {state !== "Loading" &&
            state.patients !== undefined &&
            state.patients.map((patient) => {
              return (
                <li key={patient.id}>
                  <PatientInfo
                    id={patient.id}
                    first={patient.first}
                    last={patient.last}
                    birthdate={patient.birthdate}
                    address={patient.address}
                    zip={patient.postal_code}
                    diagnosis={patient.diagnosis}
                    hospital={patient.hospital}
                    socialWorker={patient.socialWorker}
                    view="Social Worker"
                    socialWorkerId={socialWorkerId}
                  />
                </li>
              );
            })}
        </ul>
        <br />
        <br />
      </div>
    </div>
  );
}

export default SocialWorkerPatients;
