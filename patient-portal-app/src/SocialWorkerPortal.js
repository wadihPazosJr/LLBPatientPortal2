import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {Link} from 'react-router-dom';
import SocialWorkerInfo from "./Components/SocialWorkerInfo";

const SocialWorkerPortal = () => {
  let { socialWorkerId } = useParams();
  let [state, setState] = useState("Loading");

  useEffect(() => {
    console.log("Hit the use effect")
    const getSocialWorkerInfo = () => {
      fetch(`/constituent/socialWorker?id=${socialWorkerId}`)
        .then((res) => res.json())
        .then((res) => {
          setState({
            first: res.first,
            last: res.last,
            email: res.email,
            hospital: res.hospital,
          });
        });
    };

    getSocialWorkerInfo();
  }, [socialWorkerId]);

  if (state === "Loading") {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Welcome {`${state.first} ${state.last}`}!</h1>
        <br />
        <br />
        <Link to={`/s-portal/${socialWorkerId}`}>Your Info</Link>
        <br />
        <br />
        
        <Link to={`/s-portal/${socialWorkerId}/patients`}>Patients</Link>
        <br />
        <br />
        <h1>Your Info:</h1>
        <SocialWorkerInfo id={socialWorkerId} first={state.first} last={state.last} email={state.email} hospital={state.hospital} />
      </div>
    );
  }
};

export default SocialWorkerPortal;
