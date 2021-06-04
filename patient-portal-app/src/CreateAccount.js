//Need to add validation for emails and phone number.
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {hospitalArr, diagnosisArray} from "./Components/ImportedArrays";


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
  const [parentOneState, setParentOneState] = useState();
  const [parentOneZip, setParentOneZip] = useState();
  const [parentOneCountry, setParentOneCountry] = useState();
  const [parentOneVeteran, setParentOneVeteran] = useState();

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
  const [patientState, setPatientState] = useState();
  const [patientZip, setPatientZip] = useState();
  const [patientCountry, setPatientCountry] = useState();

  const [successSubmit, setSuccessSubmit] = useState(false);
  const [socialWorkerMessage, setSocialWorkerMessage] = useState("");

  const formatReqBody = () => {
    return {
      patient: {
        address: {
          address_lines: patientAddress,
          city: patientCity,
          state: patientState,
          country: patientCountry,
          postal_code: patientZip,
          type: "Home",
        },
        birthdate: {
          d: parseInt(patientDay),
          m: parseInt(patientMonth),
          y: parseInt(patientYear),
        },
        first: patientFirst,
        gender: patientGender,
        last: patientLast,
        type: "Individual",
        inactive: false,
      },
      parent:
        {
          address: {
            address_lines: parentOneAddress,
            city: parentOneCity,
            state: parentOneState,
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
          inactive: false,
        },
      hospitalName: patientHospital,
      socialWorkerEmail: patientSocialWorker,
      diagnosis: patientDiagnosis,
      veteran: parentOneVeteran,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("hitting this");
    const {message, socialWorker} = await fetch("/constituent/family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatReqBody()),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    console.log(`message response was ${JSON.stringify(message)}`);

    if (message === "Successfully made new family") {
      setSocialWorkerMessage(socialWorker);
      setSuccessSubmit(true);
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
          <option value="">Prefer not to say</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
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
          <option value="">Other</option>
          <option value="African American/African Black/Caribbean">
            African American/African Black/Caribbean
          </option>
          <option value="Asian">Asian</option>
          <option value="Caucasion">Caucasion</option>
          <option value="Hispanic/Latino">Hispanic/Latino</option>
          <option value="Native American">Native American</option>
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
        <label>State</label>
        <br />
        <select
          required
          name="parentOneState"
          value={parentOneState}
          onChange={(e) => setParentOneState(e.target.value)}
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
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <br />
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
          <option value="">Prefer not to say</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <br />
        <label>Ethnicity:</label>
        <br />
        <select
          required
          name="patientEthnicity"
          value={patientEthnicity}
          onChange={(e) => setPatientEthnicity(e.target.value)}
        >
          <option value="">Other</option>
          <option value="African American/African Black/Caribbean">
            African American/African Black/Caribbean
          </option>
          <option value="Asian">Asian</option>
          <option value="Caucasion">Caucasion</option>
          <option value="Hispanic/Latino">Hispanic/Latino</option>
          <option value="Native American">Native American</option>
        </select>
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
        <br/>
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
        <input required type="submit" value="Create New Family" />
      </form>
    </div>
  );
};

export default CreateAccount;
