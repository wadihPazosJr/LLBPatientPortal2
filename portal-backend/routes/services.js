const express = require("express");
const app = express();

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
  const actions = actionsResponse.value;
  actions.forEach(action => console.log(JSON.stringify(action)));

  Promise.all(
    actions.map(async (action, i) => {
      console.log(`Working on ${i} action\n\n`);
      const { value: customFields } = await ServicesModel.getCustomFieldsAction(
        action.id,
        req.header
      );

      const preferredRetailer = customFields.find(
        (customField) => customField.category === "Preferred Retailer"
      );

      return { index: i, value: preferredRetailer };
    })
  ).then((values) => {
    values.forEach((value) => {
      console.log(`working on ${JSON.stringify(value)}`);
      actions[value.index].preferredRetailer = {
        id: value.value.id,
        value: value.value.value,
      };
    });

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

  await ServicesModel.updateActionCustomField(
    req.body.preferredRetailer.id,
    JSON.stringify({
      value: req.body.preferredRetailer.value,
    }),
    req.header
  );

  res.send({ message: "Success" });
});


//Creates a service and redirects back to the right portal
app.post("/create", async (req, res) => {
  console.log("starting to create service");
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

  const customFieldActionId = await ServicesModel.addActionCustomField(
    JSON.stringify({
      category: "Preferred Retailer",
      parent_id: newActionId,
      value: req.body.preferredRetailer,
    }),
    req.header
  );

  console.log(
    `Done creating service the custom field id is : ${JSON.stringify(
      customFieldActionId
    )}`
  );

  if (parentId !== undefined) {
    res.send({redirectUrl: `/p-portal/${parentId}/services?patientId=${patientId}`})
  } else {
    console.log(`/s-portal/${socialWorkerId}/patients/services?patientId=${patientId}&patientName=${patientName}`)
    res.send({redirectUrl: `/s-portal/${socialWorkerId}/patients/services?patientId=${patientId}&patientName=${patientName}`})
  }
});

module.exports = app;
