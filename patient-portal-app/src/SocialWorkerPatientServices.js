import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";
import LLBService from "./Components/LLBService";

function SocialWorkerPatientServices() {
  let { socialWorkerId } = useParams();
  const search = useLocation().search;
  const patientId = new URLSearchParams(search).get("patientId");
  const patientName = new URLSearchParams(search).get("patientName");

  let [state, setState] = useState("Loading");

  let [showCompleted, setShowCompleted] = useState(true);
  let [showInProgress, setShowInProgress] = useState(true);

  useEffect(() => {
    const getServices = () => {
      fetch(`/services?id=${patientId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            setState({ services: res });
          }
        });
    };

    getServices();
  }, [socialWorkerId]);

  return (
    <div>
      <h1>Services Page</h1>
      <br />
      <br />
      <Link to={`/s-portal/${socialWorkerId}`}>Your Info</Link>
      <br />
      <br />

      <Link to={`/s-portal/${socialWorkerId}/patients`}>Patients</Link>
      <br />
      <br />
      <div>
        <h1>{patientName} Services: </h1>
        <ul>
          <button
            onClick={() => {
              setShowCompleted(true);
              setShowInProgress(true);
            }}
          >
            Show All Services
          </button>
          <button
            onClick={() => {
              setShowCompleted(true);
              setShowInProgress(false);
            }}
          >
            Show Completed Services
          </button>
          <button
            onClick={() => {
              setShowCompleted(false);
              setShowInProgress(true);
            }}
          >
            Show Services In Progress
          </button>
          {state !== "Loading" &&
            state.services !== undefined &&
            showInProgress &&
            state.services.map((service, i) => {
              const dateArr = service.date_added.split("-");

              const requestDate = `${dateArr[1]}/${dateArr[2].substring(
                0,
                2
              )}/${dateArr[0]}`;

              if (service.status !== "Completed")
                return (
                  <li key={service.id}>
                    <LLBService
                      id={service.id}
                      type={service.type}
                      status={service.status}
                      requestDate={requestDate}
                      preferredRetailer={service.preferredRetailer}
                      description={service.description}
                      attachment={service.attachment}
                    />
                  </li>
                );
            })}

          {state !== "Loading" &&
            state.services !== undefined &&
            showCompleted &&
            state.services.map((service, i) => {
              const dateArr = service.date_added.split("-");

              const requestDate = `${dateArr[1]}/${dateArr[2].substring(
                0,
                2
              )}/${dateArr[0]}`;

              if (service.status === "Completed")
                return (
                  <li key={service.id}>
                    <LLBService
                      id={service.id}
                      type={service.type}
                      status={service.status}
                      requestDate={requestDate}
                      preferredRetailer={service.preferredRetailer}
                      description={service.description}
                      attachment={service.attachment}
                    />
                  </li>
                );
            })}
        </ul>
        <br />
        <br />
        <Link
          to={`/s-portal/${socialWorkerId}/patients/services/new?patientId=${patientId}&patientName=${patientName}`}
        >
          Add new service
        </Link>
      </div>
    </div>
  );
}

export default SocialWorkerPatientServices;
