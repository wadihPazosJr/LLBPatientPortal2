import React, { useState } from "react";
import Select from "react-select";

function LLBService({
  description,
  id,
  preferredRetailer,
  type,
  requestDate,
  status,
}) {
  const [onEdit, setOnEdit] = useState(false);
  console.log(preferredRetailer);
  const [typeOfAssistance, setTypeOfAssistance] = useState({
    value: type,
    label: type,
  });

  const [preferredRetailerNew, setPreferredRetailerNew] = useState({
    value: preferredRetailer.value,
    label: preferredRetailer.value,
  });
  const [additionalNotes, setAdditionalNotes] = useState(description);

  const handleEditServiceClick = (e) => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/services/update?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typeOfAssistance: typeOfAssistance,
        preferredRetailer: {
          id: preferredRetailer.id,
          value: preferredRetailerNew.value,
        },
        additionalNotes: additionalNotes,
      }),
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
    console.log("reloaded page and finished");
  };

  const deleteService = () => {
    fetch(`/services/delete?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.redirect) {
          alert(res.message);
          window.location.href = res.redirect;
        } else {
          if (res.message === "successfully deleted action") {
            window.location.reload();
          }
        }
      });
  };

  if (onEdit) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>Type of Assistance</label>
          <br />
          <br />
          <Select
            value={typeOfAssistance}
            onChange={(option) => setTypeOfAssistance(option)}
            options={[
              { value: "Gas", label: "Gas" },
              { value: "Food", label: "Food" },
              { value: "Utilities", label: "Utilities" },
              { value: "Transportation", label: "Transportation" },
              { value: "Medical Co-payments", label: "Medical Co-payments" },
              { value: "Other", label: "Other" },
            ]}
            name="typeOfAssistance"
            placeholder="Select a type of assistance"
          />
          <br />
          <br />
          <label>Preferred Retailer</label>
          <br />
          <br />
          <Select
            value={preferredRetailerNew}
            onChange={(option) => setPreferredRetailerNew(option)}
            options={[
              { value: "Walmart", label: "Walmart" },
              { value: "Publix", label: "Publix" },
              { value: "Exxon/Mobil Gas", label: "Exxon/Mobil Gas" },
              { value: "Chevron/Texaco Gas", label: "Chevron/Texaco Gas" },
              { value: "Shell", label: "Shell" },
              { value: "Other", label: "Other" },
            ]}
            name="preferredRetailerNew"
            placeholder="Select a preferred retailer"
          />
          <br />
          <br />
          <label>Additional Notes</label>
          <br />
          <br />
          <textarea
            required
            name="additionalNotes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          ></textarea>
          <br />
          <br />
          <input type="submit" value="Update Service"></input>
          <br />
          <br />
          <button onClick={deleteService}>Delete Service</button>
          <br />
          <br />
          <button onClick={handleEditServiceClick}>Cancel</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h4>Status: {status === "Completed" ? "Completed" : "In Progress"}</h4>
        <h4>Date service was requested: {requestDate}</h4>
        <h4>Preferred Retailer: {preferredRetailer.value}</h4>
        <h4>Additional Notes: {description}</h4>
        {status !== "Completed" && (
          <button onClick={handleEditServiceClick}>Edit Service</button>
        )}
      </div>
    );
  }
}

export default LLBService;
