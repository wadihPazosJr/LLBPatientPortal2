import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ParentInfo from "./Components/ParentInfo";
import PatientInfo from "./Components/PatientInfo";
import LogoutButton from "./Components/LogoutButton";

function PatientPortal() {
  let { parentId } = useParams();
  const [state, setState] = useState("Loading");

  useEffect(() => {
    const getFamilyInfo = () => {
      fetch(`/constituent/family?id=${parentId}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            const patient = res.patient;
            const parentOne = res.parent;
            const socialWorker =
              res.socialWorker !== "" ? res.socialWorker : "";

            setState({
              patient: {
                id: patient.id,
                address: {
                  id: patient.address.id,
                  value: `${patient.address.address_lines}, ${patient.address.city}, ${patient.address.state}, ${patient.address.country}`,
                },
                postal_code: patient.address.postal_code,
                birthdate: `${patient.birthdate.m}/${patient.birthdate.d}/${patient.birthdate.y}`,
                first: patient.first,
                last: patient.last,
                diagnosis: {
                  id: res.patientDiagnosis.id,
                  value: res.patientDiagnosis.value,
                },
                hospital: res.hospital,
              },

              parent: {
                id: parentOne.id,
                address: {
                  id: parentOne.address.id,
                  value: `${parentOne.address.address_lines}, ${parentOne.address.city}, ${parentOne.address.state}, ${parentOne.address.country}`,
                },
                postal_code: parentOne.address.postal_code,
                email: {
                  id: parentOne.email.id,
                  value: parentOne.email.address,
                },
                first: parentOne.first,
                last: parentOne.last,
                phone: {
                  id: parentOne.phone.id,
                  value: parentOne.phone.number,
                },
                veteran: res.veteran,
              },
              socialWorker:
                socialWorker !== ""
                  ? {
                      email: socialWorker.email.address,
                      name: `${socialWorker.first} ${socialWorker.last}`,
                      relationshipId: socialWorker.relationshipId,
                    }
                  : "",
            });
          }
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
        <Link
          to={`/p-portal/${parentId}/services?patientId=${state.patient.id}`}
        >
          Services
        </Link>
        <br />
        <br />
        <LogoutButton></LogoutButton>
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
          id={state.parent.id}
          first={state.parent.first}
          last={state.parent.last}
          address={state.parent.address}
          postal_code={state.parent.postal_code}
          email={state.parent.email}
          phone={state.parent.phone}
          veteran={state.parent.veteran}
        />
      </div>
    );
  }
}

export default PatientPortal;
