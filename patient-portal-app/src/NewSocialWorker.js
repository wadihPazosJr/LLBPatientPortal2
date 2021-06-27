import React, { useState, useEffect } from "react";
import { hospitalArr } from "./Components/ImportedArrays";
import { Link, useParams } from "react-router-dom";
import { isEmpty, validEmail } from "./Components/ValidationFunctions";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

const NewSocialWorker = () => {
  let { patientId, swEmail } = useParams();
  let [state, setState] = useState({
    first: "",
    last: "",
    email: swEmail,
    hospital: "",
  });

  let [validation, setValidation] = useState({
    firstError: "",
    lastError: "",
    emailError: "",
    hospitalError: "",
  });

  let [didSubmit, setDidSubmit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let oldValidation = {
      firstError: "",
      lastError: "",
      emailError: "",
      hospitalError: "",
    };

    if (isEmpty(state.first)) {
      oldValidation.firstError = "Please provide a first name";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.last)) {
      oldValidation.lastError = "Please provide a last name";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.hospital)) {
      oldValidation.hospitalError = "Please specify a hospital";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.email) || !validEmail(state.email)) {
      oldValidation.emailError = "Please provide a valid email";
      setValidation(oldValidation);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const accountAlreadyCreated = async () => {
      fetch(`/constituent/constituentExists?email=${swEmail}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.constituentExists) {
            alert("This url is invalid. The account has already been created");
            window.location.href = "/";
          }
        })
        .catch((err) => console.log(err));
    };

    accountAlreadyCreated();
  });

  const handleChange = (e) => {
    let newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      fetch(`/constituent/socialWorker/create?id=${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "Success") {
            setDidSubmit(true);
          }
        });
    }
  };

  if (didSubmit) {
    return (
      <div>
        <h1>Your account has been created</h1>
        <br />
        <br />
        <h2>You can now log in to your portal using the email you supplied</h2>
        <br />
        <br />
        <Link to="/">Click here to return to Login</Link>
      </div>
    );
  } else {
    return (
      <form onSubmit={handleOnSubmit}>
        <h1>Create a new social worker account</h1>
        <br />
        <br />
        <label>First Name:</label>
        <br />
        <input
          className="e-input"
          name="first"
          type="text"
          value={state.first}
          onChange={handleChange}
        />
        <div>{validation.firstError}</div>
        <br />
        <label>Last Name:</label>
        <br />
        <input
          className="e-input"
          name="last"
          type="text"
          value={state.last}
          onChange={handleChange}
        />
        <div>{validation.lastError}</div>
        <br />
        <label>Email address:</label>
        <br />
        <input
          className="e-input"
          name="email"
          type="text"
          value={state.email}
          onChange={handleChange}
        />
        <div>{validation.emailError}</div>
        <br />
        <label>Hospital</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={hospitalArr}
          placeholder="Select a Hospital"
          value={state.hospital}
          change={(e) => {
            let oldState = { ...state };
            oldState.hospital = e.value;
            setState(oldState);
          }}
        />
        <div>{validation.hospitalError}</div>
        <br />
        <br />
        {isLoading ? (
          <p>Please wait...</p>
        ) : (
          <input type="submit" value="Create Account"></input>
        )}
      </form>
    );
  }
};

export default NewSocialWorker;
