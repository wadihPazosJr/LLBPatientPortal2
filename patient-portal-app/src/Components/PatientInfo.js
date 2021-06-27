import React, { useState } from "react";
import { Link } from "react-router-dom";
import { hospitalArr, diagnosisArray, stateArr } from "./ImportedArrays";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { isEmpty, validEmail } from "./ValidationFunctions";

function PatientInfo(props) {
  console.log(props);
  const addressArr = props.address.value.split(", ");
  const birthDayArr = props.birthdate.split("/");
  const rightHospital =
    props.hospital.value !== undefined
      ? props.hospital.value.replaceAll(",", "")
      : "";
  const [onEdit, setOnEdit] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [patientFirst, setPatientFirst] = useState(props.first);
  const [patientLast, setPatientLast] = useState(props.last);
  const [patientDiagnosis, setPatientDiagnosis] = useState(
    props.diagnosis.value
  );
  const [patientHospital, setPatientHospital] = useState(rightHospital);

  const [patientSocialWorker, setPatientSocialWorker] = useState(
    props.socialWorker !== "" ? props.socialWorker.email : ""
  );

  const [patientAddress, setPatientAddress] = useState(addressArr[0]);
  const [patientCity, setPatientCity] = useState(addressArr[1]);
  const [patientState, setPatientState] = useState(addressArr[2]);
  const [patientZip, setPatientZip] = useState(props.zip);
  const [patientCountry, setPatientCountry] = useState(addressArr[3]);

  const [validation, setValidation] = useState({
    patientDiagnosisError: "",
    patientHospitalError: "",
    patientSocialWorkerError: "",
    patientAddressError: "",
    patientCityError: "",
    patientStateError: "",
    patientZipError: "",
    patientCountryError: "",
  });

  const validate = () => {
    let oldValidation = {
      patientFirstError: "",
      patientLastError: "",
      patientBirthDayError: "",
      patientDiagnosisError: "",
      patientHospitalError: "",
      patientSocialWorkerError: "",
      patientAddressError: "",
      patientCityError: "",
      patientStateError: "",
      patientCountryError: "",
    };

    //Birthday validation

    if (isEmpty(patientDiagnosis)) {
      oldValidation.patientDiagnosisError = "Please provide a diagnosis";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientHospital)) {
      oldValidation.patientHospitalError = "Please provide a hospital";
      setValidation(oldValidation);
      return false;
    }

    if (!isEmpty(patientSocialWorker) && !validEmail(patientSocialWorker)) {
      oldValidation.patientSocialWorkerError =
        "Please provide a valid email address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientAddress)) {
      oldValidation.patientAddressError = "Please provide an address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientCity)) {
      oldValidation.patientCityError = "Please provide a city";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientState)) {
      oldValidation.patientStateError = "Please provide a state";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientZip)) {
      oldValidation.patientZipError = "Please provide a zip code";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(patientCountry)) {
      oldValidation.patientCountryError = "Please provide a country";
      setValidation(oldValidation);
      return false;
    }

    return true;
  };

  const handleButtonClick = () => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      const reqBody = {
        type: "Patient",
        constituentInfo: {
          first: patientFirst,
          last: patientLast,
          birthdate: {
            d: parseInt(birthDayArr[1]),
            m: parseInt(birthDayArr[0]),
            y: parseInt(birthDayArr[2]),
          },
          address: {
            id: props.address.id,
            address_lines: patientAddress,
            city: patientCity,
            state: patientState,
            zip: patientZip,
            country: patientCountry,
          },
        },
        customFields: [
          {
            id: props.diagnosis.id,
            value: patientDiagnosis,
          },
        ],
        socialWorkerRelationship: {
          update:
            props.socialWorker.email !== patientSocialWorker &&
            patientSocialWorker !== "",
          relationship_id:
            props.socialWorker !== "" ? props.socialWorker.relationshipId : "",
          methodToGetNewConstituent: "email",
          type: "Patient",
          reciprocal_type: "Social Worker",
          value: patientSocialWorker,
        },
        hospitalRelationship: {
          update: rightHospital !== patientHospital && patientHospital !== "",
          relationship_id:
            rightHospital !== "" ? props.hospital.relationshipId : "",
          methodToGetNewConstituent: "name",
          type: "Patient",
          reciprocal_type: "Hospital",
          value: patientHospital,
        },
      };

      console.log(
        `About to update patient and the request body: ${JSON.stringify(
          reqBody
        )}`
      );

      fetch(`/constituent/updatePatient?id=${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(reqBody),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(
            `Finished the call of updating and the value of the response is ${res}`
          );

          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            if (res.message !== "") {
              alert(res.message);
            }
            window.location.reload();
          }
        });
    }
  };

  const handleDeletePatient = () => {
    setIsLoading(true);
    fetch(
      `/constituent/socialWorker/deletePatient?id=${props.socialWorker.relationshipId}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.redirect) {
          alert(res.message);
          window.location.href = res.redirect;
        } else {
          if (res.message === "Success") {
            window.location.reload();
          }
        }
      });
  };

  if (onEdit) {
    return (
      <form onSubmit={handleSubmit}>
        <h1>
          Edit {props.first} {props.last}
        </h1>
        <br />
        <label>Diagnosis</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={diagnosisArray}
          placeholder="Select a diagnosis"
          value={patientDiagnosis}
          change={(e) => {
            setPatientDiagnosis(e.value);
          }}
        />
        <div>{validation.patientDiagnosisError}</div>
        <br />
        <label>Hospital</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={hospitalArr}
          placeholder="Select a Hospital"
          value={patientHospital}
          change={(e) => {
            setPatientHospital(e.value);
          }}
        />
        <div>{validation.patientHospitalError}</div>
        <br />
        <label>Social Worker Email</label>
        <br />
        <input
          className="e-input"
          name="patientSocialWorker"
          type="text"
          value={patientSocialWorker}
          onChange={(e) => setPatientSocialWorker(e.target.value)}
        />
        <div>{validation.patientSocialWorkerError}</div>
        <br />
        <label>address</label>
        <br />
        <input
          className="e-input"
          name="patientAddress"
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />
        <div>{validation.patientAddressError}</div>
        <br />
        <label>city</label>
        <br />
        <input
          className="e-input"
          name="patientCity"
          type="text"
          value={patientCity}
          onChange={(e) => setPatientCity(e.target.value)}
        />
        <div>{validation.patientCityError}</div>
        <br />
        <label>State</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={stateArr}
          fields={{ text: "name", value: "abbreviation" }}
          placeholder="Select a state"
          value={patientState}
          change={(e) => {
            setPatientState(e.value);
          }}
        />
        <br />
        <div>{validation.patientStateError}</div>
        <label>zip code</label>
        <br />
        <input
          className="e-input"
          name="patientZip"
          type="text"
          value={patientZip}
          onChange={(e) => setPatientZip(e.target.value)}
        />
        <div>{validation.patientZipError}</div>
        <br />
        <label>country</label>
        <br />
        <input
          className="e-input"
          name="patientCountry"
          type="text"
          value={patientCountry}
          onChange={(e) => setPatientCountry(e.target.value)}
        />
        <div>{validation.patientCountryError}</div>
        <br />
        <br />
        {isLoading ? (
          <p>Please wait...</p>
        ) : (
          <>
            <input type="submit" value="Update Info"></input>
            <br />
            <br />
            {props.view === "Social Worker" && (
              <>
                <button onClick={handleDeletePatient}>Delete Patient</button>
                <br />
                <br />
              </>
            )}

            <button onClick={handleButtonClick}>Cancel</button>
          </>
        )}
      </form>
    );
  } else {
    return (
      <ul>
        <li>First name: {props.first}</li>
        <li>Last name: {props.last}</li>
        <li>Birthday: {props.birthdate}</li>
        <li>Address: {props.address.value}</li>
        <li>Zip code: {props.zip}</li>
        <li>Diagnosis: {props.diagnosis.value}</li>
        <li>Hospital: {props.hospital.value}</li>
        <li>Social worker name: {props.socialWorker.name}</li>
        <li>Social worker email: {props.socialWorker.email}</li>
        <button onClick={handleButtonClick}>Edit info</button>
        <br />
        {props.view === "Social Worker" && (
          <Link
            to={`/s-portal/${
              props.socialWorkerId
            }/patients/services?patientId=${
              props.id
            }&patientName=${`${props.first} ${props.last}`}`}
          >
            Patient's services
          </Link>
        )}
      </ul>
    );
  }
}

export default PatientInfo;
