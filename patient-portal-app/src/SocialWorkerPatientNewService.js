import React, { useState } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

function SocialWorkerPatientNewService() {
  const search = useLocation().search;
  const { socialWorkerId } = useParams();
  const patientId = new URLSearchParams(search).get("patientId");
  const patientName = new URLSearchParams(search).get("patientName");

  const [state, setState] = useState({
    additionalNotes: "",
    preferredRetailer: "",
    typeOfAssistance: "",
    preferredRetailerIsOther: false,
  });

  const [bill, setBill] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    let oldState = { ...state };
    oldState[e.target.name] = e.target.value;
    setState(oldState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (bill !== "") {
      const formData = new FormData();
      formData.append("file", bill); // appending file

      let fileId, fileName;

      await fetch("/services/createFile", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            fileId = res.file_id;
            fileName = res.file_name;
          }
        });

      console.log(
        `Starting to create action: ${fileId}, ${fileName}, ${JSON.stringify({
          additionalNotes: state.additionalNotes,
          typeOfAssistance: state.typeOfAssistance,
          fileInfo: { file_id: fileId, file_name: fileName },
        })}`
      );
      fetch(
        `/services/create?socialWorkerId=${socialWorkerId}&patientId=${patientId}&patientName=${patientName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            additionalNotes: state.additionalNotes,
            typeOfAssistance: state.typeOfAssistance,
            fileInfo: { file_id: fileId, file_name: fileName },
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            console.log("hit redirect should redirect to: " + res.redirectUrl);
            window.location.href = res.redirectUrl;
          }
        });
    } else {
      fetch(
        `/services/create?socialWorkerId=${socialWorkerId}&patientId=${patientId}&patientName=${patientName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            additionalNotes: state.additionalNotes,
            typeOfAssistance: state.typeOfAssistance,
            preferredRetailer: state.preferredRetailer,
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.redirect) {
            alert(res.message);
            window.location.href = res.redirect;
          } else {
            window.location.href = res.redirectUrl;
          }
        });
    }
  };

  if (isLoading) {
    return <p>Please wait...</p>;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <h1>Request new Service: </h1>
        <br />
        <br />
        <DropDownListComponent
          id="ddlelement"
          dataSource={[
            "Gas",
            "Food",
            "Utilities",
            "Mortgage/Rent",
            "Transportation",
            "Medical Co-payments",
            "Funeral/Memorial",
            "Other",
          ]}
          placeholder="Select a Type of Assistance"
          value={state.typeOfAssistance}
          change={(e) => {
            let oldState = { ...state };
            oldState.typeOfAssistance = e.value;
            setState(oldState);
          }}
        />
        <br />
        <br />
        {state.typeOfAssistance === "Gas" && (
          <DropDownListComponent
            id="ddlelement"
            dataSource={[
              "Exxon/Mobil Gas",
              "Chevron/Texaco Gas",
              "Shell",
              "Walmart",
              "Other",
            ]}
            placeholder="Select a Preferred Retailer"
            value={state.preferredRetailer}
            change={(e) => {
              let oldState = { ...state };
              oldState.preferredRetailer = e.value !== "Other" ? e.value : "";
              if (e.value === "Other") {
                oldState.preferredRetailerIsOther = true;
              }
              setState(oldState);
            }}
          />
        )}
        {state.typeOfAssistance === "Food" && (
          <DropDownListComponent
            id="ddlelement"
            dataSource={["Publix", "Walmart", "Kroger", "Target", "Other"]}
            placeholder="Select a Preferred Retailer"
            value={state.preferredRetailer}
            change={(e) => {
              let oldState = { ...state };
              oldState.preferredRetailer = e.value !== "Other" ? e.value : "";
              if (e.value === "Other") {
                oldState.preferredRetailerIsOther = true;
              }
              setState(oldState);
            }}
          />
        )}

        {state.preferredRetailerIsOther && state.preferredRetailer === "" && (
          <input
            required
            name="otherPreferredRetailer"
            type="text"
            className="e-input"
            value={state.preferredRetailer}
            onChange={handleChange}
            placeholder="Please specify your preferred retailer"
          />
        )}

        {state.typeOfAssistance !== "Gas" &&
          state.typeOfAssistance !== "Food" &&
          state.typeOfAssistance !== "" && (
            <div>
              <h3>Please upload the bill</h3>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0]; // accessing file
                  console.log(file);
                  setBill(file);
                }}
              />
            </div>
          )}
        <br />
        <br />

        {(state.preferredRetailer !== "" || bill !== "") && (
          <textarea
            name="additionalNotes"
            value={state.additionalNotes}
            onChange={handleChange}
            placeholder="Please specify any additional notes pertaining to your request. If you chose other, please use this section to be more specific."
          ></textarea>
        )}
        <br />
        <br />
        <input type="submit" value="Add new service"></input>
      </form>
    );
  }
}

export default SocialWorkerPatientNewService;
