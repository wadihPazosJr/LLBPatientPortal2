import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";
import LLBService from "./Components/LLBService";

function PatientServices() {
  let { parentId } = useParams();
  const search = useLocation().search;
  const patientId = new URLSearchParams(search).get("patientId");

  let [state, setState] = useState("Loading");

  useEffect(() => {
    const getServices = () => {
      fetch(`/constituent/services?id=${patientId}`)
        .then((res) => res.json())
        .then((res) => {
          setState({ services: res });
        });
    };

    getServices();
  }, [parentId]);

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
          {
            /* The additional Notes and request Date aren't working*/
            state !== "Loading" &&
              state.services !== undefined &&
              state.services.map((service, i) => {
                const dateArr = service.date_added.split("-");

                const requestDate = `${dateArr[1]}/${dateArr[2].substring(
                  0,
                  2
                )}/${dateArr[0]}`;
                /* return (
                  <li key={service.id}>
                    <h3>
                      {i + 1}. Request for {service.type}
                    </h3>
                    <h4>Status: {service.status}</h4>
                    <h4>Date service was requested: {requestDate}</h4>
                    <h4>Preferred Retailer: {service.preferredRetailer}</h4>
                    <h4>Additional Notes: {service.description}</h4>
                  </li>
                ); */

                return (
                  <li key={service.id}>
                    <LLBService
                    i={i + 1}
                    id={service.id}
                    type={service.type}
                    status = {service.status}
                    requestDate = {requestDate}
                    preferredRetailer = {service.preferredRetailer}
                    description={service.description}
                  />
                  </li>
                )
              })
          }
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
