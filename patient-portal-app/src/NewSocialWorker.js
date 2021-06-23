import React, { useState, useEffect } from "react";
import { hospitalArr } from "./Components/ImportedArrays";
import { Link, useParams } from "react-router-dom";

const NewSocialWorker = () => {
  let { patientId, swEmail } = useParams();
  let [state, setState] = useState({
    first: "",
    last: "",
    email: swEmail,
    hospital: "",
  });

  let [didSubmit, setDidSubmit] = useState(false);

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
  };

    if (didSubmit) {
      return (
        <div>
          <h1>Your account has been created</h1>
          <br />
          <br />
          <h2>
            You can now log in to your portal using the email you supplied
          </h2>
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
            required
            name="first"
            type="text"
            value={state.first}
            onChange={handleChange}
          />
          <br />
          <label>Last Name:</label>
          <br />
          <input
            required
            name="last"
            type="text"
            value={state.last}
            onChange={handleChange}
          />
          <br />
          <label>Email address:</label>
          <br />
          <input
            required
            name="email"
            type="text"
            value={state.email}
            onChange={handleChange}
          />
          <br />
          <label>Hospital</label>
          <br />
          <select
            required
            name="hospital"
            value={state.hospital}
            onChange={handleChange}
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
          <br />
          <input type="submit" value="Create Account"></input>
        </form>
      );
    }
  }


export default NewSocialWorker;
