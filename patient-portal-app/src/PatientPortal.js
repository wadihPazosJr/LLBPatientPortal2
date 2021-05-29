import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Link} from 'react-router-dom';
import ParentInfo from "./Components/ParentInfo";
import PatientInfo from './Components/PatientInfo'

function PatientPortal() {
  let { parentId } = useParams();
  const [state, setState] = useState("Loading");

  useEffect(() => {
    const getFamilyInfo = () => {
      fetch(`/constituent/family?id=${parentId}`)
        .then((res) => res.json())
        .then((res) => {
          const patient = res.patient;
          const parentOne = res.parents[0];
          const parentTwo =
            res.parents.length === 2 ? res.parents[1] : res.parents[0];
          const socialWorker = res.socialWorker !== "" ? res.socialWorker : "";

          setState({
            patient: {
              id: patient.id,
              address: {id: patient.address.id, value: `${patient.address.address_lines}, ${patient.address.city}, ${patient.address.state}, ${patient.address.country}`},
              postal_code: patient.address.postal_code,
              birthdate: `${patient.birthdate.m}/${patient.birthdate.d}/${patient.birthdate.y}`,
              first: patient.first,
              last: patient.last,
              diagnosis: {id: res.patientDiagnosis.id, value: res.patientDiagnosis.value},
              hospital: res.hospital,
            },

            parents: [
              {
                id: parentOne.id,
                address: {id: parentOne.address.id, value: `${parentOne.address.address_lines}, ${parentOne.address.city}, ${parentOne.address.state}, ${parentOne.address.country}`},
                postal_code: parentOne.address.postal_code,
                email: {id: parentOne.email.id, value: parentOne.email.address},
                first: parentOne.first,
                last: parentOne.last,
                phone: {id: parentOne.phone.id, value: parentOne.phone.number},
                veteran: res.veteran[0],
              },
              {
                id: parentTwo.id,
                address: {id: parentTwo.address.id, value: `${parentTwo.address.address_lines}, ${parentTwo.address.city}, ${parentTwo.address.state}, ${parentTwo.address.country}`},
                postal_code: parentTwo.address.postal_code,
                email: parentTwo.email.address,
                first: parentTwo.first,
                gender: parentTwo.gender,
                last: parentTwo.last,
                phone: parentTwo.phone.number,
                veteran:
                  res.veteran.length >= 1 ? res.veteran[1] : res.veteran[0],
              },
            ],

            socialWorker: socialWorker !== "" ? {
              email: socialWorker.email.address,
              name: `${socialWorker.first} ${socialWorker.last}`,
              relationshipId: socialWorker.relationshipId
            } : "",
          });
        })
        .catch((err) => console.log(err));
    };

    getFamilyInfo();
  }, [parentId]);

  if (state === "Loading") {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome {state.patient.last} family!</h1>
        <br />
        <br />
        <Link to={`/p-portal/${parentId}`}>Family Info</Link>
        <br />
        <br />
        <Link to={`/p-portal/${parentId}/services?patientId=${state.patient.id}`}>Services</Link>
        <br />
        <br />
        <h1>Patient Info:</h1>
        <PatientInfo
          id={state.patient.id}
          first={state.patient.first}
          last={state.patient.last}
          birthdate={state.patient.birthdate}
          address={state.patient.address}
          zip={state.patient.postal_code}
          diagnosis={state.patient.diagnosis}
          hospital={state.patient.hospital}
          socialWorker={state.socialWorker}
          view="Patient"
        />
        <h1>Parent one:</h1>
        <ParentInfo
          id={state.parents[0].id}
          first={state.parents[0].first}
          last={state.parents[0].last}
          address={state.parents[0].address}
          postal_code={state.parents[0].postal_code}
          email={state.parents[0].email}
          phone={state.parents[0].phone}
          veteran={state.parents[0].veteran}
        />
        <h1>Parent two:</h1>
        <ParentInfo
          id={state.parents[1].id}
          first={state.parents[1].first}
          last={state.parents[1].last}
          address={state.parents[1].address}
          postal_code={state.parents[1].postal_code}
          email={state.parents[1].email}
          phone={state.parents[1].phone}
          veteran={state.parents[1].veteran}
        />
      </div>
    );
  }
}

export default PatientPortal;
