//Need to add validation for emails and phone number.
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  hospitalArr,
  diagnosisArray,
  stateArr,
} from "./Components/ImportedArrays";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const CreateAccount = () => {
  //Properties

  let [successSubmit, setSuccessSubmit] = useState(false);
  let [socialWorkerMessage, setSocialWorkerMessage] = useState("");
  let [submitting, setSubmitting] = useState(false);

  const [state, setState] = useState({
    parentFirst: "",
    parentLast: "",
    parentGender: "",
    parentEthnicity: "",
    parentEmail: "",
    parentPhone: "",
    parentAddress: "",
    parentCity: "",
    parentState: "",
    parentZip: "",
    parentCountry: "",
    parentVeteran: "",
    patientFirst: "",
    patientLast: "",
    patientGender: "",
    patientEthnicity: "",
    patientBirthDay: "",
    patientDiagnosis: "",
    patientHospital: "",
    patientSocialWorker: "",
    patientAddress: "",
    patientCity: "",
    patientState: "",
    patientCountry: "",
  });

  const handleChange = (e) => {
    console.log(e);
    const newState = { ...state };
    const targetName = e.target.name;
    const targetValue = e.target.value;
    newState[targetName] = targetValue;
    setState(newState);
    console.log(state);
  };

  const formatReqBody = () => {
    let dateArr = state.patientBirthDay.substring(0, 10).split("-");
    return {
      patient: {
        address: {
          address_lines: state.patientAddress,
          city: state.patientCity,
          state: state.patientState,
          country: state.patientCountry,
          postal_code: state.patientZip,
          type: "Home",
        },
        birthdate: {
          d: parseInt(dateArr[2]),
          m: parseInt(dateArr[1]),
          y: parseInt(dateArr[0]),
        },
        first: state.patientFirst,
        gender: state.patientGender,
        last: state.patientLast,
        type: "Individual",
        inactive: false,
      },
      parent: {
        address: {
          address_lines: state.parentAddress,
          city: state.parentCity,
          state: state.parentState,
          country: state.parentCountry,
          postal_code: state.parentZip,
          type: "Home",
        },
        email: {
          address: state.parentEmail,
          type: "Email",
        },
        first: state.parentFirst,
        gender: state.parentGender,
        last: state.parentLast,
        phone: {
          number: state.parentPhone,
          type: "None",
        },
        type: "Individual",
        inactive: false,
      },
      hospitalName: state.patientHospital,
      socialWorkerEmail: state.patientSocialWorker,
      diagnosis: state.patientDiagnosis,
      veteran: state.parentVeteran,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let constituentDoesntExist = false;
    await fetch(`/constituent/constituentExists?email=${state.parentEmail}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.constituentExists) {
          alert(
            "An account with the email you supplied already exists, try logging in with that email."
          );
          window.location.href = "/";
        } else {
          constituentDoesntExist = true;
        }
      })
      .catch((err) => console.log(err));

    console.log(
      `value of constituentDoesnt Exist is: ${constituentDoesntExist}`
    );
    if (constituentDoesntExist) {
      const { message, socialWorker } = await fetch("/constituent/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatReqBody()),
      })
        .then((response) => response.json())
        .catch((error) => console.log(error));

      console.log(`message response was ${JSON.stringify(message)}`);

      if (message === "Successfully made new family") {
        setSocialWorkerMessage(socialWorker);
        setSuccessSubmit(true);
      }
    }
  };

  if (successSubmit) {
    return (
      <div>
        <h1>{`Your account has been created\n${socialWorkerMessage}`}</h1>
        <h1>You can login with google with the email you supplied</h1>
        <Link to="/">Click here to return to Login</Link>
      </div>
    );
  } else if (submitting) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>Create new family account</h1>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <h1>Parent Info</h1>
          <br />
          <input
            placeholder="First Name"
            required
            name="parentFirst"
            type="text"
            className="e-input"
            value={state.parentFirst}
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            required
            placeholder="Last Name"
            name="parentLast"
            type="text"
            className="e-input"
            value={state.parentLast}
            onChange={handleChange}
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={["Male", "Female"]}
            placeholder="Select a gender"
            value={state.parentGender}
            change={(e) => {
              let oldState = { ...state };
              oldState.parentGender = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={[
              "African American/African Black/Caribbean",
              "Asian",
              "Caucasion",
              "Hispanic/Latino",
              "Native American",
              "Other",
            ]}
            placeholder="Select an ethnicity"
            value={state.parentEthnicity}
            change={(e) => {
              let oldState = { ...state };
              oldState.parentEthnicity = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <input
            required
            name="parentEmail"
            type="text"
            className="e-input"
            value={state.parentEmail}
            onChange={handleChange}
            placeholder="Email"
          />
          <br />
          <br />
          <input
            required
            name="parentPhone"
            type="text"
            className="e-input"
            value={state.parentPhone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <br />
          <br />
          <input
            required
            name="parentAddress"
            type="text"
            className="e-input"
            value={state.parentAddress}
            onChange={handleChange}
            placeholder="Address"
          />
          <br />
          <br />
          <input
            required
            name="parentCity"
            type="text"
            className="e-input"
            value={state.parentCity}
            onChange={handleChange}
            placeholder="City"
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={stateArr}
            fields={{ text: "name", value: "abbreviation" }}
            placeholder="Select a state"
            value={state.parentState}
            change={(e) => {
              let oldState = { ...state };
              oldState.parentState = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <input
            required
            name="parentZip"
            type="text"
            className="e-input"
            value={state.parentZip}
            onChange={handleChange}
            placeholder="Zip Code"
          />
          <br />
          <br />
          <input
            required
            name="parentCountry"
            type="text"
            className="e-input"
            value={state.parentCountry}
            onChange={handleChange}
            placeholder="Country"
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={["Yes", "No"]}
            placeholder="Are you a veteran?"
            value={state.parentVeteran}
            change={(e) => {
              let oldState = { ...state };
              oldState.parentVeteran = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <h1>Patient or child info</h1>
          <br />
          <input
            required
            name="patientFirst"
            type="text"
            className="e-input"
            value={state.patientFirst}
            onChange={handleChange}
            placeholder="First Name"
          />
          <br />
          <br />
          <input
            required
            name="patientLast"
            type="text"
            className="e-input"
            value={state.patientLast}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={["Male", "Female"]}
            placeholder="Select a gender"
            value={state.patientGender}
            change={(e) => {
              let oldState = { ...state };
              oldState.patientGender = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={[
              "African American/African Black/Caribbean",
              "Asian",
              "Caucasion",
              "Hispanic/Latino",
              "Native American",
              "Other",
            ]}
            placeholder="Select an ethnicity"
            value={state.patientEthnicity}
            change={(e) => {
              let oldState = { ...state };
              oldState.patientEthnicity = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <DatePickerComponent
            value={state.patientBirthDay}
            change={(e) => {
              const newState = { ...state };
              newState.patientBirthDay = e.value.toISOString();
              setState(newState);
            }}
            name="patientBirthDay"
            placeholder="Enter Patient Birthdate"
          />
          <br />

          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={diagnosisArray}
            placeholder="Select a diagnosis"
            value={state.patientDiagnosis}
            change={(e) => {
              let oldState = { ...state };
              oldState.patientDiagnosis = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={hospitalArr}
            placeholder="Select a Hospital"
            value={state.patientHospital}
            change={(e) => {
              let oldState = { ...state };
              oldState.patientHospital = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <input
            required
            name="patientSocialWorker"
            type="text"
            className="e-input"
            value={state.patientSocialWorker}
            onChange={handleChange}
            placeholder="Social Worker Email"
          />
          <br />
          <br />
          <input
            required
            name="patientAddress"
            type="text"
            className="e-input"
            value={state.patientAddress}
            onChange={handleChange}
            placeholder="Address"
          />
          <br />
          <br />
          <input
            required
            name="patientCity"
            type="text"
            className="e-input"
            value={state.patientCity}
            onChange={handleChange}
            placeholder="City"
          />
          <br />
          <br />
          <DropDownListComponent
            id="ddlelement"
            dataSource={stateArr}
            fields={{ text: "name", value: "abbreviation" }}
            placeholder="Select a state"
            value={state.patientState}
            change={(e) => {
              let oldState = { ...state };
              oldState.patientState = e.value;
              setState(oldState);
            }}
          />
          <br />
          <br />
          <input
            required
            name="patientZip"
            type="text"
            className="e-input"
            value={state.patientZip}
            onChange={handleChange}
            placeholder="Zip Code"
          />
          <br />
          <br />
          <input
            required
            name="patientCountry"
            type="text"
            className="e-input"
            value={state.patientCountry}
            onChange={handleChange}
            placeholder="Country"
          />
          <br />
          <br />
          <ButtonComponent onClick={e=> {
            setSubmitting(true);
            handleSubmit(e)
            }}>
            Create New Family
          </ButtonComponent>
        </form>
      </div>
    );
  }
};

export default CreateAccount;
