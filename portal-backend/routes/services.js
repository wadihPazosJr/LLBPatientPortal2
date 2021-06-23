const express = require("express");
const app = express();
const fetch = require("node-fetch");

const ServicesModel = require("../models/servicesModel");

//Deletes a constituent's service based off the service's id
app.delete("/delete", (req, res) => {
  const idOfAction = req.query.id;
  ServicesModel.deleteAction(idOfAction, req.header).then((response) =>
    res.send({ message: response })
  );
});

//Gets all actions of a constituent based off the cosntituent's id
app.get("/", async (req, res) => {
  const actionsResponse = await ServicesModel.getAllActions(
    req.query.id,
    req.header
  );

  if (actionsResponse.count === 0) {
    return res.send([]);
  }

  const actions = actionsResponse.value;
  actions.forEach((action) => console.log(JSON.stringify(action)));

  Promise.all(
    actions.map(async (action, i) => {
      console.log(`Working on ${i} action\n\n`);

      //Check if they got any custom fields, if they do return the custom fields

      //Check if they got any attachments, if they do return the attachment

      const customFieldsResponse = await ServicesModel.getCustomFieldsAction(
        action.id,
        req.header
      );

      const attachmentsResponse = await ServicesModel.getAttachmentsAction(
        action.id,
        req.header
      );

      if (customFieldsResponse.count > 0) {
        const customFields = customFieldsResponse.value;
        const preferredRetailer = customFields.find(
          (customField) => customField.category === "Preferred Retailer"
        );
        return {
          index: i,
          value: preferredRetailer,
          isPreferredRetailer: true,
        };
      }

      if (attachmentsResponse.count > 0) {
        const attachment = attachmentsResponse.value[0];

        return { index: i, value: attachment, isPreferredRetailer: false };
      }

      return 0;
    })
  ).then((values) => {
    values.forEach((value) => {
      //Check if it is a preferredRetailer or an attachment and set the right field accordingly
      if (value !== 0) {
        if (value.isPreferredRetailer) {
          actions[value.index].preferredRetailer = {
            id: value.value.id,
            value: value.value.value,
          };

          actions[value.index].attachment = "";
        } else {
          console.log(JSON.stringify(value));
          actions[value.index].attachment = {
            url: value.value.url,
            name: value.value.file_name,
            id: value.value.id,
          };
          actions[value.index].preferredRetailer = "";
        }
      }
    });

    actions.forEach((action) => console.log(JSON.stringify(action)));

    res.send(actions);
  });
});

//Updates a service
app.patch("/update", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  var body = JSON.stringify({
    description: req.body.additionalNotes,
    type: req.body.typeOfAssistance.value,
  });

  await ServicesModel.updateService(req.query.id, body, req.header);

  if (req.body.preferredRetailer) {
    await ServicesModel.updateActionCustomField(
      req.body.preferredRetailer.id,
      JSON.stringify({
        value: req.body.preferredRetailer.value,
      }),
      req.header
    );
  }

  if (req.body.fileInfo) {
    await ServicesModel.deleteActionAttachment(
      req.body.fileInfo.oldAttachmentId,
      req.header
    );

    await ServicesModel.createAttachment(
      JSON.stringify({
        file_id: req.body.fileInfo.file_id,
        file_name: req.body.fileInfo.file_name,
        parent_id: req.query.id,
        type: "Physical",
        name: req.body.fileInfo.file_name,
      }),
      req.header
    );
  }

  res.send({ message: "Success" });
});

app.post("/create", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  const patientId = req.query.patientId;
  const parentId = req.query.parentId;
  const socialWorkerId = req.query.socialWorkerId;
  const patientName = req.query.patientName;

  const date = new Date();
  date.toISOString();
  const reqBody = {
    category: "Task/Other",
    constituent_id: patientId,
    date: date,
    description: req.body.additionalNotes,
    type: req.body.typeOfAssistance,
  };
  const { id: newActionId } = await ServicesModel.createService(
    JSON.stringify(reqBody),
    req.header
  );

  if (req.body.preferredRetailer) {
    await ServicesModel.addActionCustomField(
      JSON.stringify({
        category: "Preferred Retailer",
        parent_id: newActionId,
        value: req.body.preferredRetailer,
      }),
      req.header
    );
  }

  if (req.body.fileInfo) {
    await ServicesModel.createAttachment(
      JSON.stringify({
        file_id: req.body.fileInfo.file_id,
        file_name: req.body.fileInfo.file_name,
        parent_id: newActionId,
        type: "Physical",
        name: req.body.fileInfo.file_name,
      }),
      req.header
    );
  }

  if (parentId !== undefined) {
    res.send(
      JSON.stringify({
        redirectUrl: `/p-portal/${parentId}/services?patientId=${patientId}`,
      })
    );
  } else {
    console.log(
      `/s-portal/${socialWorkerId}/patients/services?patientId=${patientId}&patientName=${patientName}`
    );
    res.send(
      JSON.stringify({
        redirectUrl: `/s-portal/${socialWorkerId}/patients/services?patientId=${patientId}&patientName=${patientName}`,
      })
    );
  }
});

//Creates a file with Blackbaud, so you can add the attachment later, returns File ID.
app.post("/createFile", async (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  // accessing the file
  const myFile = req.files.file;
  //Create blackbaud document
  req.header["Content-Type"] = "application/json";
  const newBlackbaudDocument = await ServicesModel.createDocument(
    JSON.stringify({ file_name: myFile.name, upload_thumbnail: false }),
    req.header
  );

  const fileCreateURL = newBlackbaudDocument.file_upload_request.url;
  const fileCreateMethod = newBlackbaudDocument.file_upload_request.method;
  const fileCreateHeaders = newBlackbaudDocument.file_upload_request.headers;
  let realHeaders = {
    /* "Content-Type": "application/" */
  };

  fileCreateHeaders.forEach((header) => {
    realHeaders[header.name] = header.value;
  });
  //Upload the actual file data based off the info they gave u

  fetch(fileCreateURL, {
    headers: realHeaders,
    method: fileCreateMethod,
    body: myFile.data,
  }).catch((err) => console.log(err));

  //Send back whatever information you need to add the attachment to the action.
  res.send(
    JSON.stringify({
      file_id: newBlackbaudDocument.file_id,
      file_name: myFile.name,
    })
  );
});

module.exports = app;
