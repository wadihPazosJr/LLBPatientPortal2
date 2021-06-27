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

import {
  isEmpty,
  validEmail,
  isValidPhoneNumber,
} from "./Components/ValidationFunctions";

const CreateAccount = () => {
  //Properties

  let [successSubmit, setSuccessSubmit] = useState(false);
  let [socialWorkerMessage, setSocialWorkerMessage] = useState("");
  let [submitting, setSubmitting] = useState(false);

  const [validation, setValidation] = useState({
    parentFirstError: "",
    parentLastError: "",
    parentGenderError: "",
    parentEthnicityError: "",
    parentEmailError: "",
    parentPhoneError: "",
    parentAddressError: "",
    parentCityError: "",
    parentStateError: "",
    parentZipError: "",
    parentCountryError: "",
    parentVeteranError: "",
    patientFirstError: "",
    patientLastError: "",
    patientGenderError: "",
    patientEthnicityError: "",
    patientBirthDayError: "",
    patientDiagnosisError: "",
    patientHospitalError: "",
    patientSocialWorkerError: "",
    patientAddressError: "",
    patientCityError: "",
    patientStateError: "",
    patientCountryError: "",
  });

  let [areErrors, setAreErrors] = useState(false);

  const validate = () => {
    let oldValidation = {
      parentFirstError: "",
      parentLastError: "",
      parentGenderError: "",
      parentEthnicityError: "",
      parentEmailError: "",
      parentPhoneError: "",
      parentAddressError: "",
      parentCityError: "",
      parentStateError: "",
      parentZipError: "",
      parentCountryError: "",
      parentVeteranError: "",
      patientFirstError: "",
      patientLastError: "",
      patientGenderError: "",
      patientEthnicityError: "",
      patientBirthDayError: "",
      patientDiagnosisError: "",
      patientHospitalError: "",
      patientSocialWorkerError: "",
      patientAddressError: "",
      patientCityError: "",
      patientStateError: "",
      patientCountryError: "",
    };

    setAreErrors(true);

    if (isEmpty(state.parentFirst)) {
      oldValidation.parentFirstError =
        "Please provide the parent's first name.";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentLast)) {
      oldValidation.parentLastError = "Please provide the parent's last name.";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentGender)) {
      oldValidation.parentGenderError = "Please provide the parent's gender";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentEthnicity)) {
      oldValidation.parentEthnicityError =
        "Please provide the parent's ethnicity";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentEmail) || !validEmail(state.parentEmail)) {
      oldValidation.parentEmailError = "Please provide a valid email";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentPhone) || !isValidPhoneNumber(state.parentPhone)) {
      oldValidation.parentPhoneError = "Please provide a valid phone number";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentAddress)) {
      oldValidation.parentAddressError = "Please provide an address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentCity)) {
      oldValidation.parentCityError = "Please provide a city";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentState)) {
      oldValidation.parentStateError = "Please provide a state";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentZip)) {
      oldValidation.parentZipError = "Please provide a zip code";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentCountry)) {
      oldValidation.parentCountryError = "Please provide a country";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.parentVeteran)) {
      oldValidation.parentVeteranError =
        "Please specify whether or not you are a veteran";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientFirst)) {
      oldValidation.patientFirstError =
        "Please provide the patient's first name.";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientLast)) {
      oldValidation.patientLastError =
        "Please provide the patient's last name.";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientGender)) {
      oldValidation.patientGenderError = "Please provide the patient's gender";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientEthnicity)) {
      oldValidation.patientEthnicityError =
        "Please provide the patient's ethnicity";
      setValidation(oldValidation);
      return false;
    }

    //Birthday validation
    if (isEmpty(state.patientBirthDay)) {
      oldValidation.patientBirthDayError = "Please select a date.";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientDiagnosis)) {
      oldValidation.patientDiagnosisError = "Please provide a diagnosis";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientHospital)) {
      oldValidation.patientHospitalError = "Please provide a hospital";
      setValidation(oldValidation);
      return false;
    }

    if (
      !isEmpty(state.patientSocialWorker) &&
      !validEmail(state.patientSocialWorker)
    ) {
      oldValidation.patientSocialWorkerError =
        "Please provide a valid email address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientAddress)) {
      oldValidation.patientAddressError = "Please provide an address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientCity)) {
      oldValidation.patientCityError = "Please provide a city";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientState)) {
      oldValidation.patientStateError = "Please provide a state";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientZip)) {
      oldValidation.patientZipError = "Please provide a zip code";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(state.patientCountry)) {
      oldValidation.patientCountryError = "Please provide a country";
      setValidation(oldValidation);
      return false;
    }

    setAreErrors(true);

    return true;
  };

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
    if (validate()) {
      setSubmitting(true);
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
        <form id="createAccountForm" onSubmit={handleSubmit}>
          <h1>Parent Info</h1>
          <br />
          <input
            placeholder="First Name"
            name="parentFirst"
            type="text"
            className="e-input"
            value={state.parentFirst}
            onChange={handleChange}
          />
          <div>{validation.parentFirstError}</div>
          <br />
          <br />
          <input
            placeholder="Last Name"
            name="parentLast"
            type="text"
            className="e-input"
            value={state.parentLast}
            onChange={handleChange}
          />
          <div>{validation.parentLastError}</div>
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
          <div>{validation.parentGenderError}</div>

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
          <div>{validation.parentEthnicityError}</div>
          <br />
          <br />
          <input
            name="parentEmail"
            type="text"
            className="e-input"
            value={state.parentEmail}
            onChange={handleChange}
            placeholder="Email"
          />
          <div>{validation.parentEmailError}</div>
          <br />
          <br />
          <input
            name="parentPhone"
            type="text"
            className="e-input"
            value={state.parentPhone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <div>{validation.parentPhoneError}</div>
          <br />
          <br />
          <input
            name="parentAddress"
            type="text"
            className="e-input"
            value={state.parentAddress}
            onChange={handleChange}
            placeholder="Address"
          />
          <div>{validation.parentAddressError}</div>
          <br />
          <br />
          <input
            name="parentCity"
            type="text"
            className="e-input"
            value={state.parentCity}
            onChange={handleChange}
            placeholder="City"
          />
          <div>{validation.parentCityError}</div>
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
          <div>{validation.parentStateError}</div>
          <br />
          <br />
          <input
            name="parentZip"
            type="text"
            className="e-input"
            value={state.parentZip}
            onChange={handleChange}
            placeholder="Zip Code"
          />
          <div>{validation.parentZipError}</div>
          <br />
          <br />
          <input
            name="parentCountry"
            type="text"
            className="e-input"
            value={state.parentCountry}
            onChange={handleChange}
            placeholder="Country"
          />
          <div>{validation.parentCountryError}</div>
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
          <div>{validation.parentVeteranError}</div>
          <br />
          <br />
          <h1>Patient or child info</h1>
          <br />
          <input
            name="patientFirst"
            type="text"
            className="e-input"
            value={state.patientFirst}
            onChange={handleChange}
            placeholder="First Name"
          />
          <div>{validation.patientFirstError}</div>

          <br />
          <br />
          <input
            name="patientLast"
            type="text"
            className="e-input"
            value={state.patientLast}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <div>{validation.patientLastError}</div>
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
          <div>{validation.patientGenderError}</div>
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
          <div>{validation.patientEthnicityError}</div>
          <br />
          <br />
          <DatePickerComponent
            value={state.patientBirthDay}
            change={(e) => {
              const newState = { ...state };
              let oldValidation = { ...validation };
              if (typeof e.value === "string") {
                oldValidation.patientBirthDayError = "Please select a date.";
                setValidation(oldValidation);
              } else {
                oldValidation.patientBirthDayError = "";
                setValidation(oldValidation);
                newState.patientBirthDay = e.value.toISOString();
                setState(newState);
              }
            }}
            name="patientBirthDay"
            placeholder="Enter Patient Birthdate"
          />
          <div>{validation.patientBirthDayError}</div>
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
          <div>{validation.patientDiagnosisError}</div>
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
          <div>{validation.patientHospitalError}</div>
          <br />
          <br />
          <input
            name="patientSocialWorker"
            type="text"
            className="e-input"
            value={state.patientSocialWorker}
            onChange={handleChange}
            placeholder="Social Worker Email"
          />
          <div>{validation.patientSocialWorkerError}</div>
          <br />
          <br />
          <input
            name="patientAddress"
            type="text"
            className="e-input"
            value={state.patientAddress}
            onChange={handleChange}
            placeholder="Address"
          />
          <div>{validation.patientAddressError}</div>
          <br />
          <br />
          <input
            name="patientCity"
            type="text"
            className="e-input"
            value={state.patientCity}
            onChange={handleChange}
            placeholder="City"
          />
          <div>{validation.patientCityError}</div>
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
          <div>{validation.patientStateError}</div>
          <br />
          <br />
          <input
            name="patientZip"
            type="text"
            className="e-input"
            value={state.patientZip}
            onChange={handleChange}
            placeholder="Zip Code"
          />
          <div>{validation.patientZipError}</div>
          <br />
          <br />
          <input
            name="patientCountry"
            type="text"
            className="e-input"
            value={state.patientCountry}
            onChange={handleChange}
            placeholder="Country"
          />
          <div>{validation.patientCountryError}</div>
          <br />
          <br />
          {areErrors && <p>Please fix any errors before submitting</p>}
          <ButtonComponent
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Create New Family
          </ButtonComponent>
        </form>
      </div>
    );
  }
};

export default CreateAccount;
