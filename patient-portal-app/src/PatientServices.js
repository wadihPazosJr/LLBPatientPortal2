import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";
import LLBService from "./Components/LLBService";

function PatientServices() {
  let { parentId } = useParams();
  const search = useLocation().search;
  const patientId = new URLSearchParams(search).get("patientId");

  let [state, setState] = useState("Loading");

  let [showCompleted, setShowCompleted] = useState(true);
  let [showInProgress, setShowInProgress] = useState(true);

  useEffect(() => {
    const getServices = () => {
      fetch(`/constituent/services?id=${patientId}`)
        .then((res) => res.json())
        .then((res) => {
          setState({ services: res });
        });
    };

    getServices();
  });

  return (
    <div>
      <h1>Services Page</h1>
      <br />
      <br />
      <Link to={`/p-portal/${parentId}`}>Family Info</Link>
      <br />
      <br />
      <Link to={`/p-portal/${parentId}/services?patientId=${patientId}`}>
        Services
      </Link>
      <br />
      <br />
      <div>
        <h1>Services: </h1>
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
                    />
                  </li>
                );
            })}
        </ul>
        <br />
        <br />
        <Link to={`/p-portal/${parentId}/services/new?patientId=${patientId}`}>
          Add new service
        </Link>
      </div>
    </div>
  );
}

export default PatientServices;