import React, { useState } from "react";
import { hospitalArr } from "./ImportedArrays";

function SocialWorkerInfo(props) {
  const rightHospital =
    props.hospital.value !== undefined
      ? props.hospital.value.replaceAll(",", "")
      : "";

  const [onEdit, setOnEdit] = useState(false);
  const [first, setFirst] = useState(props.first);
  const [last, setLast] = useState(props.last);
  const [email, setEmail] = useState(props.email.value);
  const [hospital, setHospital] = useState(rightHospital);

  const handleButtonClick = () => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      first: first,
      last: last,
      email: { id: props.email.id, value: email },
      hospital: {
        update: rightHospital !== hospital && hospital !== "",
        relationship_id:
          rightHospital !== "" && props.hospital.id !== undefined? props.hospital.id : "",
        methodToGetNewConstituent: "name",
        type: "Social Worker",
        reciprocal_type: "Hospital",
        value: hospital,
      },
    };

    fetch(`/constituent/socialWorker/updateInfo?id=${props.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.redirect) {
          window.location.reload();
        }
      });
  };

  if (onEdit) {
    return (
      <form onSubmit={handleOnSubmit}>
        <label>First Name:</label>
        <br />
        <input
          required
          name="first"
          type="text"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          required
          name="last"
          type="text"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
        <br />
        <label>Email address:</label>
        <br />
        <input
          required
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Hospital</label>
        <br />
        <select
          required
          name="hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
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
        <input type="submit" value="Update Info"></input>
        <br />
        <button onClick={handleButtonClick}>Cancel</button>
      </form>
    );
  } else {
    return (
      <ul>
        <li>First name: {props.first}</li>
        <li>Last name: {props.last}</li>
        <li>Email: {props.email.value}</li>
        <li>Hospital: {rightHospital}</li>
        <button onClick={handleButtonClick}>Edit Info</button>
      </ul>
    );
  }
}

export default SocialWorkerInfo;
