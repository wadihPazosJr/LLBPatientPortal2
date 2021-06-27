import React, { useState } from "react";
import { isEmpty, validEmail, isValidPhoneNumber } from "./ValidationFunctions";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { stateArr } from "./ImportedArrays";
function ParentInfo(props) {
  const addressArr = props.address.value.split(", ");
  const [onEdit, setOnEdit] = useState(false);
  const [parentFirst, setParentFirst] = useState(props.first);
  const [parentLast, setParentLast] = useState(props.last);
  const [parentEmail, setParentEmail] = useState(props.email.value);
  const [parentPhone, setParentPhone] = useState(props.phone.value);
  const [parentAddress, setParentAddress] = useState(addressArr[0]);
  const [parentCity, setParentCity] = useState(addressArr[1]);
  const [parentState, setParentState] = useState(addressArr[2]);
  const [parentZip, setParentZip] = useState(props.postal_code);
  const [parentCountry, setParentCountry] = useState(addressArr[3]);
  const [parentVeteran, setParentVeteran] = useState(props.veteran.value);

  const [isLoading, setIsLoading] = useState(false);

  const [validation, setValidation] = useState({
    parentEmailError: "",
    parentPhoneError: "",
    parentAddressError: "",
    parentCityError: "",
    parentStateError: "",
    parentZipError: "",
    parentCountryError: "",
    parentVeteranError: "",
  });

  const validate = () => {
    let oldValidation = {
      parentEmailError: "",
      parentPhoneError: "",
      parentAddressError: "",
      parentCityError: "",
      parentStateError: "",
      parentZipError: "",
      parentCountryError: "",
      parentVeteranError: "",
    };

    if (isEmpty(parentEmail) || !validEmail(parentEmail)) {
      oldValidation.parentEmailError = "Please provide a valid email";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentPhone) || !isValidPhoneNumber(parentPhone)) {
      oldValidation.parentPhoneError = "Please provide a valid phone number";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentAddress)) {
      oldValidation.parentAddressError = "Please provide an address";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentCity)) {
      oldValidation.parentCityError = "Please provide a city";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentState)) {
      oldValidation.parentStateError = "Please provide a state";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentZip)) {
      oldValidation.parentZipError = "Please provide a zip code";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentCountry)) {
      oldValidation.parentCountryError = "Please provide a country";
      setValidation(oldValidation);
      return false;
    }

    if (isEmpty(parentVeteran)) {
      oldValidation.parentVeteranError =
        "Please specify whether or not you are a veteran";
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
    console.log("Started submit");
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      const reqBody = {
        type: "Parent",
        constituentInfo: {
          first: parentFirst,
          last: parentLast,
          email: { id: props.email.id, value: parentEmail },
          phone: { id: props.phone.id, value: parentPhone },
          address: {
            id: props.address.id,
            address_lines: parentAddress,
            city: parentCity,
            state: parentState,
            zip: parentZip,
            country: parentCountry,
          },
        },
        customFields: [
          {
            id: props.veteran.id,
            value: parentVeteran,
          },
        ],
      };

      fetch(`/constituent/updateParent?id=${props.id}`, {
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
        <h1>
          Edit {props.first} {props.last}
        </h1>
        <label>Email address:</label>
        <br />
        <input
          className="e-input"
          name="parentEmail"
          type="text"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
        />
        <div>{validation.parentEmailError}</div>
        <br />
        <label>Phone Number (must be in following format: xxx-xxx-xxxx):</label>
        <br />
        <input
          className="e-input"
          name="parentPhone"
          type="text"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <div>{validation.parentPhoneError}</div>
        <br />
        <label>address</label>
        <br />
        <input
          className="e-input"
          name="parentAddress"
          type="text"
          value={parentAddress}
          onChange={(e) => setParentAddress(e.target.value)}
        />
        <div>{validation.parentAddressError}</div>
        <br />
        <label>city</label>
        <br />
        <input
          className="e-input"
          name="parentCity"
          type="text"
          value={parentCity}
          onChange={(e) => setParentCity(e.target.value)}
        />
        <div>{validation.parentCityError}</div>
        <br />
        <label>State</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={stateArr}
          fields={{ text: "name", value: "abbreviation" }}
          placeholder="Select a state"
          value={parentState}
          change={(e) => {
            setParentState(e.value);
          }}
        />
        <div>{validation.parentStateError}</div>
        <br />
        <label>zip code</label>
        <br />
        <input
          className="e-input"
          name="parentZip"
          type="text"
          value={parentZip}
          onChange={(e) => setParentZip(e.target.value)}
        />
        <div>{validation.parentZipError}</div>
        <br />

        <label>country</label>
        <br />
        <input
          className="e-input"
          name="parentCountry"
          type="text"
          value={parentCountry}
          onChange={(e) => setParentCountry(e.target.value)}
        />
        <div>{validation.parentCountryError}</div>
        <br />
        <label>Are you a veteran?</label>
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={["Yes", "No"]}
          placeholder="Are you a veteran?"
          value={parentVeteran}
          change={(e) => {
            setParentVeteran(e.value);
          }}
        />
        <div>{validation.parentVeteranError}</div>
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
        <li>Address: {props.address.value}</li>
        <li>Zip code: {props.postal_code}</li>
        <li>Email: {props.email.value}</li>
        <li>Phone: {props.phone.value}</li>
        <li>Are you a veteran? : {props.veteran.value}</li>
        <button onClick={handleButtonClick}>Edit Info</button>
      </ul>
    );
  }
}

export default ParentInfo;
