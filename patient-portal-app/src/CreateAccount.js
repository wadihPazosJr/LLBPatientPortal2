//Need to add validation for emails and phone number.
// Need to make the Hospital field a select and diagnosis one too


import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CreateAccount = () => {
  //Properties
  const [parentOneFirst, setParentOneFirst] = useState();
  const [parentOneLast, setParentOneLast] = useState();
  const [parentOneGender, setParentOneGender] = useState();
  const [parentOneEthnicity, setParentOneEthnicity] = useState();
  const [parentOneEmail, setParentOneEmail] = useState();
  const [parentOnePhone, setParentOnePhone] = useState();
  const [parentOneAddress, setParentOneAddress] = useState();
  const [parentOneCity, setParentOneCity] = useState();
  const [parentOneZip, setParentOneZip] = useState();
  const [parentOneCountry, setParentOneCountry] = useState();
  const [parentOneVeteran, setParentOneVeteran] = useState();

  const [parentTwoFirst, setParentTwoFirst] = useState();
  const [parentTwoLast, setParentTwoLast] = useState();
  const [parentTwoGender, setParentTwoGender] = useState();
  const [parentTwoEthnicity, setParentTwoEthnicity] = useState();
  const [parentTwoEmail, setParentTwoEmail] = useState();
  const [parentTwoPhone, setParentTwoPhone] = useState();
  const [parentTwoAddress, setParentTwoAddress] = useState();
  const [parentTwoCity, setParentTwoCity] = useState();
  const [parentTwoZip, setParentTwoZip] = useState();
  const [parentTwoCountry, setParentTwoCountry] = useState();
  const [parentTwoVeteran, setParentTwoVeteran] = useState();

  const [patientFirst, setPatientFirst] = useState();
  const [patientLast, setPatientLast] = useState();
  const [patientGender, setPatientGender] = useState();
  const [patientEthnicity, setPatientEthnicity] = useState();
  const [patientMonth, setPatientMonth] = useState();
  const [patientDay, setPatientDay] = useState();
  const [patientYear, setPatientYear] = useState();
  const [patientDiagnosis, setPatientDiagnosis] = useState();
  const [patientHospital, setPatientHospital] = useState();
  const [patientSocialWorker, setPatientSocialWorker] = useState();
  const [patientAddress, setPatientAddress] = useState();
  const [patientCity, setPatientCity] = useState();
  const [patientZip, setPatientZip] = useState();
  const [patientCountry, setPatientCountry] = useState();

  const [successSubmit, setSuccessSubmit] = useState(false);

  const formatReqBody = () => {
    return {
      patient: {
        address: {
          address_lines: patientAddress,
          city: patientCity,
          country: patientCountry,
          postal_code: patientZip,
          type: "Home",
        },
        birthdate: {
          d: patientDay,
          m: patientMonth,
          y: patientYear,
        },
        first: patientFirst,
        gender: patientGender,
        last: patientLast,
        type: "Individual",
      },
      parents: [
        {
          address: {
            address_lines: parentOneAddress,
            city: parentOneCity,
            country: parentOneCountry,
            postal_code: parentOneZip,
            type: "Home",
          },
          email: {
            address: parentOneEmail,
            type: "Email",
          },
          first: parentOneFirst,
          gender: parentOneGender,
          last: parentOneLast,
          phone: {
            number: parentOnePhone,
            type: "None",
          },
          type: "Individual",
        },
        {
          address: {
            address_lines: parentTwoAddress,
            city: parentTwoCity,
            country: parentTwoCountry,
            postal_code: parentTwoZip,
            type: "Home",
          },
          email: {
            address: parentTwoEmail,
            type: "Email",
          },
          first: parentTwoFirst,
          gender: parentTwoGender,
          last: parentTwoLast,
          phone: {
            number: parentTwoPhone,
            type: "None",
          },
          type: "Individual",
        },
      ],
      hospitalName: patientHospital,
      socialWorkerEmail: patientSocialWorker,
      diagnosis: patientDiagnosis,
      veteranOne: parentOneVeteran,
      veteranTwo: parentTwoVeteran,
    };
  };

  const handleSubmit = async (event) => {
    const message = await fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatReqBody()),
    });

    if (message === "Successfully made new family") {
      setSuccessSubmit(true);
    }

    event.preventDefault();
  };

  if (successSubmit) {
    return (
      <div>
        <h1>Your account has been created</h1>
        <h1>You can login with google with the email you supplied</h1>
        <Link to="/">Click here to return to Login</Link>
      </div>
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Parent Info</h1>
        <h2>Parent one (required)</h2>
        <label>First Name:</label>
        <br />
        <input
          required
          name="parentOneFirst"
          type="text"
          value={parentOneFirst}
          onChange={(e) => setParentOneFirst(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          required
          name="parentOneLast"
          type="text"
          value={parentOneLast}
          onChange={(e) => setParentOneLast(e.target.value)}
        />
        <br />
        <label>Gender:</label>
        <br />
        <select
          required
          name="parentOneGender"
          value={parentOneGender}
          onChange={(e) => setParentOneGender(e.target.value)}
        >
          <option value="">Select a gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="">Prefer not to say</option>
        </select>
        <br />

        <label>Ethnicity:</label>
        <br />
        <select
          required
          name="parentOneEthnicity"
          value={parentOneEthnicity}
          onChange={(e) => setParentOneEthnicity(e.target.value)}
        >
          <option value="">Select an ethnicity</option>
          <option value="African American/African Black/Caribbean">
            African American/African Black/Caribbean
          </option>
          <option value="Asian">Asian</option>
          <option value="Caucasion">Caucasion</option>
          <option value="Hispanic/Latino">Hispanic/Latino</option>
          <option value="Native American">Native American</option>
          <option value="">Other</option>
        </select>
        <br />
        <label>Email address:</label>
        <br />
        <input
          required
          name="parentOneEmail"
          type="text"
          value={parentOneEmail}
          onChange={(e) => setParentOneEmail(e.target.value)}
        />
        <br />
        <label>Phone Number (must be in following format: xxx-xxx-xxxx):</label>
        <br />
        <input
          required
          name="parentOnePhone"
          type="text"
          value={parentOnePhone}
          onChange={(e) => setParentOnePhone(e.target.value)}
        />
        <br />
        <label>address</label>
        <br />
        <input
          required
          name="parentOneAddress"
          type="text"
          value={parentOneAddress}
          onChange={(e) => setParentOneAddress(e.target.value)}
        />
        <br />
        <label>city</label>
        <br />
        <input
          required
          name="parentOneCity"
          type="text"
          value={parentOneCity}
          onChange={(e) => setParentOneCity(e.target.value)}
        />
        <br />
        <label>zip code</label>
        <br />
        <input
          required
          name="parentOneZip"
          type="text"
          value={parentOneZip}
          onChange={(e) => setParentOneZip(e.target.value)}
        />
        <br />

        <label>country</label>
        <br />
        <input
          required
          name="parentOneCountry"
          type="text"
          value={parentOneCountry}
          onChange={(e) => setParentOneCountry(e.target.value)}
        />
        <br />
        <label>Are you a veteran?</label>
        <br />
        <select
          required
          name="parentOneVeteran"
          value={parentOneVeteran}
          onChange={(e) => setParentOneVeteran(e.target.value)}
        >
          <option value="No">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br />
        <h2>Parent two (optional)</h2>
        <label>First Name:</label>
        <br />
        <input
          required
          name="parentTwoFirst"
          type="text"
          value={parentTwoFirst}
          onChange={(e) => setParentTwoFirst(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          required
          name="parentTwoLast"
          type="text"
          value={parentTwoLast}
          onChange={(e) => setParentTwoLast(e.target.value)}
        />
        <br />
        <label>Gender:</label>
        <br />
        <select
          required
          name="parentTwoGender"
          value={parentTwoGender}
          onChange={(e) => setParentTwoGender(e.target.value)}
        >
          <option value="">Select a gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="">Prefer not to say</option>
        </select>
        <br />

        <label>Ethnicity:</label>
        <br />
        <input
          required
          name="parentTwoEthnicity"
          type="text"
          value={parentTwoEthnicity}
          onChange={(e) => setParentTwoEthnicity(e.target.value)}
        />
        <br />
        <label>Email address:</label>
        <br />
        <input
          required
          name="parentTwoEmail"
          type="text"
          value={parentTwoEmail}
          onChange={(e) => setParentTwoEmail(e.target.value)}
        />
        <br />
        <label>Phone Number (must be in following format: xxx-xxx-xxxx):</label>
        <br />
        <input
          required
          name="parentTwoPhone"
          type="text"
          value={parentTwoPhone}
          onChange={(e) => setParentTwoPhone(e.target.value)}
        />
        <br />
        <label>address</label>
        <br />
        <input
          required
          name="parentTwoAddress"
          type="text"
          value={parentTwoAddress}
          onChange={(e) => setParentTwoAddress(e.target.value)}
        />
        <br />
        <label>city</label>
        <br />
        <input
          required
          name="parentTwoCity"
          type="text"
          value={parentTwoCity}
          onChange={(e) => setParentTwoCity(e.target.value)}
        />
        <br />
        <label>zip code</label>
        <br />
        <input
          required
          name="parentTwoZip"
          type="text"
          value={parentTwoZip}
          onChange={(e) => setParentTwoZip(e.target.value)}
        />
        <br />

        <label>country</label>
        <br />
        <input
          required
          name="parentTwoCountry"
          type="text"
          value={parentTwoCountry}
          onChange={(e) => setParentTwoCountry(e.target.value)}
        />
        <br />
        <label>Are you a veteran?</label>
        <br />
        <select
          required
          name="parentTwoVeteran"
          value={parentTwoVeteran}
          onChange={(e) => setParentTwoVeteran(e.target.value)}
        >
          <option value="No">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br />
        <h1>Patient or child info</h1>
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
        <label>Gender:</label>
        <br />
        <select
          required
          name="patientGender"
          value={patientGender}
          onChange={(e) => setPatientGender(e.target.value)}
        >
          <option value="">Select a gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="">Prefer not to say</option>
        </select>
        <br />
        <label>Ethnicity:</label>
        <br />
        <input
          required
          name="patientEthnicity"
          type="text"
          value={patientEthnicity}
          onChange={(e) => setPatientEthnicity(e.target.value)}
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
        <input
          required
          name="patientDiagnosis"
          type="text"
          value={patientDiagnosis}
          onChange={(e) => setPatientDiagnosis(e.target.value)}
        />
        <br />
        <label>Hospital</label>
        <br />
        <input
          required
          name="patientHospital"
          type="text"
          value={patientHospital}
          onChange={(e) => setPatientHospital(e.target.value)}
        />
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
        <input required type="submit" value="Create New Family" />
      </form>
    </div>
  );
};

export default CreateAccount;
