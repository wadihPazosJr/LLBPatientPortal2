import React, { useState } from "react";

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

  const handleButtonClick = () => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleOnSubmit = (e) => {
    console.log("Started submit");
    e.preventDefault();
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
  };

  if (onEdit) {
    return (
      <form onSubmit={handleOnSubmit}>
        <h1>
          Edit {props.first} {props.last}
        </h1>
        <label>First Name:</label>
        <br />
        <input
          required
          name="parentFirst"
          type="text"
          value={parentFirst}
          onChange={(e) => setParentFirst(e.target.value)}
        />
        <br />
        <label>Last Name:</label>
        <br />
        <input
          required
          name="parentLast"
          type="text"
          value={parentLast}
          onChange={(e) => setParentLast(e.target.value)}
        />
        <br />
        <label>Email address:</label>
        <br />
        <input
          required
          name="parentEmail"
          type="text"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
        />
        <br />
        <label>Phone Number (must be in following format: xxx-xxx-xxxx):</label>
        <br />
        <input
          required
          name="parentPhone"
          type="text"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <br />
        <label>address</label>
        <br />
        <input
          required
          name="parentAddress"
          type="text"
          value={parentAddress}
          onChange={(e) => setParentAddress(e.target.value)}
        />
        <br />
        <label>city</label>
        <br />
        <input
          required
          name="parentCity"
          type="text"
          value={parentCity}
          onChange={(e) => setParentCity(e.target.value)}
        />
        <br />
        <label>State</label>
        <br />
        <select
          required
          name="parentState"
          value={parentState}
          onChange={(e) => setParentState(e.target.value)}
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
          name="parentZip"
          type="text"
          value={parentZip}
          onChange={(e) => setParentZip(e.target.value)}
        />
        <br />

        <label>country</label>
        <br />
        <input
          required
          name="parentCountry"
          type="text"
          value={parentCountry}
          onChange={(e) => setParentCountry(e.target.value)}
        />
        <br />
        <label>Are you a veteran?</label>
        <br />
        <select
          required
          name="parentVeteran"
          value={parentVeteran}
          onChange={(e) => setParentVeteran(e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
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
