import React, { useState } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import Select from "react-select";

function SocialWorkerPatientNewService() {
    const search = useLocation().search;
    const { socialWorkerId } = useParams();
    const patientId = new URLSearchParams(search).get("patientId");
    const patientName = new URLSearchParams(search).get("patientName");
    const [additionalNotes, setAdditionalNotes] = useState();
    const [preferredRetailer, setPreferredRetailer] = useState();
    const [typeOfAssistance, setTypeOfAssistance] = useState();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const reqBody = JSON.stringify({
          typeOfAssistance: typeOfAssistance.value,
          preferredRetailer: preferredRetailer.value,
          additionalNotes: additionalNotes
      });
  
      fetch(`/service/create?socialWorkerId=${socialWorkerId}&patientId=${patientId}&patientName=${patientName}`, {
        method: "POST",
        body: reqBody,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
          console.log(res);
          if (res.redirected) {
            window.location.href = res.url;
          } else {
            return res.json();
          }
      })
      .catch((err) => {
          alert(err);
      });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Request new Service for {patientName}: </h1>
        <br />
        <br />
        <label>Type of Assistance</label>
        <br />
        <br />
        <Select
          value={typeOfAssistance}
          onChange={option => setTypeOfAssistance(option)}
          options={[
            { value: "Gas", label: "Gas" },
            { value: "Food", label: "Food" },
            { value: "Utilities", label: "Utilities" },
            { value: "Transportation", label: "Transportation" },
            { value: "Medical Co-payments", label: "Medical Co-payments" },
            { value: "Other", label: "Other" },
          ]}
          name="preferredRetailer"
          placeholder="Select a type of assistance"
        />
        <br />
        <br />
        <label>Preferred Retailer</label>
        <br />
        <br />
        <Select
          value={preferredRetailer}
          onChange={option => setPreferredRetailer(option)}
          options={[
            { value: "Walmart", label: "Walmart" },
            { value: "Publix", label: "Publix" },
            { value: "Exxon/Mobil Gas", label: "Exxon/Mobil Gas" },
            { value: "Chevron/Texaco Gas", label: "Chevron/Texaco Gas" },
            { value: "Shell", label: "Shell" },
            { value: "Other", label: "Other" },
          ]}
          name="preferredRetailer"
          placeholder="Select a preferred retailer"
        />
        <br />
        <br />
        <h3>Please be specific if you chose other for type of assistance</h3>
        <br />
        <br />
        <label>Additional Notes</label>
        <br />
        <br />
        <textarea
          required
          name="additionalNotes"
          value={additionalNotes}
          onChange={e => setAdditionalNotes(e.target.value)}
        ></textarea>
        <br />
        <br />
        <input type="submit" value="Add new service"></input>
      </form>
    );
}

export default SocialWorkerPatientNewService;