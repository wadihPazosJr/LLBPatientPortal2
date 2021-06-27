import React, { useState } from "react";
import { hospitalArr } from "./ImportedArrays";
import { isEmpty, validEmail } from "./ValidationFunctions";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
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

  const [validation, setValidation] = useState({
    firstError: "",
    lastError: "",
    hospitalError: "",
    emailError: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let oldValidation = { emailError: "", hospitalError: "" };

    if (isEmpty(hospital)) {
      oldValidation.hospitalError = "Please specify a hospital";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(email) || !validEmail(email)) {
      oldValidation.emailError = "Please provide a valid email";
      setValidation(oldValidation);
      return false;
    }

    return true;
  };

  const handleButtonClick = () => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      const reqBody = {
        first: first,
        last: last,
        email: { id: props.email.id, value: email },
        hospital: {
          update: rightHospital !== hospital && hospital !== "",
          relationship_id:
            rightHospital !== "" && props.hospital.id !== undefined
              ? props.hospital.id
              : "",
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
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            if (res.message === "Success") {
              window.location.reload();
            }
          }
        });
    }
  };

  if (onEdit) {
    return (
      <form onSubmit={handleOnSubmit}>
        <br />
        <label>Email address:</label>
        <br />
        <input
          className="e-input"
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>{validation.emailError}</div>
        <br />
        <label>Hospital</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={hospitalArr}
          placeholder="Select a Hospital"
          value={hospital}
          change={(e) => {
            setHospital(e.value);
          }}
        />
        <div>{validation.hospitalError}</div>
        <br />
        {isLoading ? (
          <p>Please wait...</p>
        ) : (
          <input type="submit" value="Update Info"></input>
        )}
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
