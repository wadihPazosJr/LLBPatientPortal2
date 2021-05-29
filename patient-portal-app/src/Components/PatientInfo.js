import React, { useState } from "react";
import { Link } from "react-router-dom";
import { hospitalArr, diagnosisArray } from "./ImportedArrays";

function PatientInfo(props) {
  console.log(props);
  const addressArr = props.address.value.split(", ");
  const birthDayArr = props.birthdate.split("/");
  const rightHospital =
    props.hospital.value !== undefined
      ? props.hospital.value.replaceAll(",", "")
      : "";
  const [onEdit, setOnEdit] = useState();
  const [patientFirst, setPatientFirst] = useState(props.first);
  const [patientLast, setPatientLast] = useState(props.last);
  const [patientMonth, setPatientMonth] = useState(birthDayArr[0]);
  const [patientDay, setPatientDay] = useState(birthDayArr[1]);
  const [patientYear, setPatientYear] = useState(birthDayArr[2]);
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

  const handleButtonClick = () => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      type: "Patient",
      constituentInfo: {
        first: patientFirst,
        last: patientLast,
        birthdate: {
          d: parseInt(patientDay),
          m: parseInt(patientMonth),
          y: parseInt(patientYear),
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
      }
    };

    console.log(
      `About to update patient and the request body: ${JSON.stringify(reqBody)}`
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
        if (res.message !== "") {
          alert(res.message);
        }
        if (res.redirect) {
          window.location.reload();
        }
      });
  };

  const handleDeletePatient = () => {
    fetch(`/constituent/socialWorker/deletePatient?id=${props.socialWorker.relationshipId}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(res => {
      if(res.redirect) {
        window.location.reload()
      }
    })
  }

  if (onEdit) {
    return (
      <form onSubmit={handleSubmit}>
        <h1>
          Edit {props.first} {props.last}
        </h1>
        <label>First Name:</label>
        <br />
        <input
          required
          name="patientFirst"
          type="text"
          value={patientFirst}
          onChange={(e) => setPatientFirst(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          required
          name="patientLast"
          type="text"
          value={patientLast}
          onChange={(e) => setPatientLast(e.target.value)}
        />
        <br />
        <h2>Date of birth:</h2>
        <label>Month</label>
        <br />
        <input
          required
          name="patientMonth"
          type="number"
          step="1"
          value={patientMonth}
          onChange={(e) => setPatientMonth(e.target.value)}
        />
        <br />
        <label>Day</label>
        <br />
        <input
          required
          name="patientDay"
          type="number"
          step="1"
          value={patientDay}
          onChange={(e) => setPatientDay(e.target.value)}
        />
        <br />
        <label>Year</label>
        <br />
        <input
          required
          name="patientYear"
          type="number"
          step="1"
          value={patientYear}
          onChange={(e) => setPatientYear(e.target.value)}
        />
        <br />
        <label>Diagnosis</label>
        <br />
        <select
          required
          name="patientDiagnosis"
          value={patientDiagnosis}
          onChange={(e) => setPatientDiagnosis(e.target.value)}
        >
          <option value="">Please select a diagnosis</option>
          {diagnosisArray.map((diagnosis, i) => {
            return (
              <option key={i} value={diagnosis}>
                {diagnosis}
              </option>
            );
          })}
        </select>
        <br />
        <label>Hospital</label>
        <br />
        <select
          required
          name="patientHospital"
          value={patientHospital}
          onChange={(e) => setPatientHospital(e.target.value)}
        >
          <option value="">Please select a hospital</option>
          {hospitalArr.map((hospital, i) => {
            return (
              <option key={i} value={hospital}>
                {hospital}
              </option>
            );
          })}
        </select>
        <br />
        <label>Social Worker Email</label>
        <br />
        <input
          required
          name="patientSocialWorker"
          type="text"
          value={patientSocialWorker}
          onChange={(e) => setPatientSocialWorker(e.target.value)}
        />
        <br />
        <label>address</label>
        <br />
        <input
          required
          name="patientAddress"
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
        />
        <br />
        <label>city</label>
        <br />
        <input
          required
          name="patientCity"
          type="text"
          value={patientCity}
          onChange={(e) => setPatientCity(e.target.value)}
        />
        <br />
        <label>State</label>
        <br />
        <select
          required
          name="patientState"
          value={patientState}
          onChange={(e) => setPatientState(e.target.value)}
        >
          <option value="">Please select a state</option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
          <option value="AS">American Samoa</option>
          <option value="GU">Guam</option>
          <option value="MP">Northern Mariana Islands</option>
          <option value="PR">Puerto Rico</option>
          <option value="UM">United States Minor Outlying Islands</option>
          <option value="VI">Virgin Islands</option>
        </select>
        <br />
        <label>zip code</label>
        <br />
        <input
          required
          name="patientZip"
          type="text"
          value={patientZip}
          onChange={(e) => setPatientZip(e.target.value)}
        />
        <br />
        <label>country</label>
        <br />
        <input
          required
          name="patientCountry"
          type="text"
          value={patientCountry}
          onChange={(e) => setPatientCountry(e.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="Update Info"></input>
        <br />
        <br />
        {props.view === "Social Worker" && <button onClick={handleDeletePatient}>Delete Patient</button>}
        <br />
        <br />
        <button onClick={handleButtonClick}>Cancel</button>
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
        <br/>
        {props.view === "Social Worker" && <Link to={`/s-portal/${props.socialWorkerId}/patients/services?patientId=${props.id}&patientName=${`${props.first} ${props.last}`}`}>Patient's services</Link>}
      </ul>
    );
  }
}

export default PatientInfo;
