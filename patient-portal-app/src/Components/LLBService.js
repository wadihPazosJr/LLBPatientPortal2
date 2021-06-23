import React, { useState } from "react";
import Select from "react-select";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

function LLBService({
  description,
  id,
  preferredRetailer,
  type,
  requestDate,
  status,
  attachment,
}) {
  const [onEdit, setOnEdit] = useState(false);
  console.log(preferredRetailer);
  const [typeOfAssistance, setTypeOfAssistance] = useState({
    value: type,
    label: type,
  });

  const [preferredRetailerNew, setPreferredRetailerNew] = useState(
    preferredRetailer.value
  );
  const [additionalNotes, setAdditionalNotes] = useState(description);

  const [newAttachment, setNewAttachment] = useState(attachment);

  const [updateAttachment, setUpdateAttachment] = useState(false);

  const [preferredRetailerIsOther, setPreferredRetailerIsOther] =
    useState(false);

  const rightPreferredRetailers = () => {
    if (type === "Gas") {
      return [
        "Exxon/Mobil Gas",
        "Chevron/Texaco Gas",
        "Shell",
        "Walmart",
        "Other",
      ];
    }

    if (type === "Food") {
      return ["Publix", "Walmart", "Kroger", "Target", "Other"];
    }
  };
  const handleEditServiceClick = (e) => {
    const currentOnEdit = onEdit;
    setOnEdit(!currentOnEdit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preferredRetailer !== "") {
      fetch(`/services/update?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          typeOfAssistance: typeOfAssistance,
          preferredRetailer: {
            id: preferredRetailer.id,
            value: preferredRetailerNew,
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
    }

    if (attachment !== "") {
      let fileId, fileName;
      // create new file
      if (updateAttachment) {
        const formData = new FormData();
        formData.append("file", newAttachment); // appending file

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

        fetch(`/services/update?id=${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            typeOfAssistance: typeOfAssistance,
            fileInfo: {
              file_id: fileId,
              file_name: fileName,
              oldAttachmentId: attachment.id,
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
      } else {
        fetch(`/services/update?id=${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            typeOfAssistance: typeOfAssistance,
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
      }
    }
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
          <h1>Type of assistance: {typeOfAssistance.value}</h1>
          <br />
          <br />
          {preferredRetailer !== "" && type === "Gas" && (
            <>
              <label>Preferred Retailer</label>
              <br />
              <br />
              <DropDownListComponent
                id="ddlelement"
                dataSource={rightPreferredRetailers()}
                placeholder="Select a Preferred Retailer"
                value={preferredRetailerNew}
                change={(e) => {
                  setPreferredRetailerNew(e.value !== "Other" ? e.value : "");

                  if (e.value === "Other") {
                    setPreferredRetailerIsOther(true);
                  } else {
                    setPreferredRetailerIsOther(false);
                  }

                  console.log(e);
                  console.log(preferredRetailerNew);
                }}
              />
            </>
          )}

          {preferredRetailerIsOther && (
            <input
              required
              name="otherPreferredRetailer"
              type="text"
              className="e-input"
              value={preferredRetailerNew}
              onChange={(e) => {
                setPreferredRetailerNew(e.target.value);
              }}
              placeholder="Please specify your preferred retailer"
            />
          )}

          {attachment !== "" && (
            <>
              <label>Bill</label>
              <br />
              <br />
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0]; // accessing file
                  console.log(file);
                  setNewAttachment(file);
                  setUpdateAttachment(true);
                }}
              />
            </>
          )}

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
        <h4>Type of Assistance: {typeOfAssistance.value}</h4>
        <h4>Status: {status === "Completed" ? "Completed" : "In Progress"}</h4>
        <h4>Date service was requested: {requestDate}</h4>
        {preferredRetailer !== "" && (
          <h4>Preferred Retailer: {preferredRetailer.value}</h4>
        )}
        {attachment !== "" && (
          <h4>
            Bill:{" "}
            <a href={attachment.url} target="_blank">
              {attachment.name}
            </a>
          </h4>
        )}
        <h4>Additional Notes: {description}</h4>
        {status !== "Completed" && (
          <button onClick={handleEditServiceClick}>Edit Service</button>
        )}
      </div>
    );
  }
}

export default LLBService;
