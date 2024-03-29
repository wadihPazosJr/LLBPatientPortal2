const express = require("express");
const app = express();

const {
  getConstituentRelationships,
  createConstituent,
  createRelationship,
  updateConstituent,
  createConstituentCode,
  addCustomField,
  getCustomFieldList,
  updateConstituentCustomField,
  updateConstituentAddress,
  updateConstituentPhone,
  updateConstituentEmail,
  deleteRelationship,
  getConstituentFromEmail,
  getConstituentFromId,
  getConstituentFromName,
  getConsituentCodeListFromId,
} = require("../models/constituentModel");

const sendEmail = require("../models/emailModel.js");

//Returns whether a constituent is a parent, patient, or socialworker based off email
app.get("/constituentFromEmail", async (req, res) => {
  let constituentInfo = await getConstituentFromEmail(
    req.query.email,
    req.header
  );
  if (constituentInfo.status === "error") {
    res.send(constituentInfo);
    return;
  }

  let constituentCodeList = await getConsituentCodeListFromId(
    constituentInfo.id,
    req.header
  );

  let parentIndex = constituentCodeList.value.findIndex(
    (code) => code.description.toLowerCase() === "parent"
  );

  let socialWorkerIndex = constituentCodeList.value.findIndex(
    (code) => code.description.toLowerCase() === "social worker"
  );

  // TODO: SWITCH IN PRODUCTION TO AN ENVIRONMENT VAIRABLE

  if (parentIndex !== -1) {
    res.redirect(`http://localhost:3000/p-portal/${constituentInfo.id}`);
  } else if (socialWorkerIndex !== -1) {
    res.redirect(`http://localhost:3000/s-portal/${constituentInfo.id}`);
  } else {
    res.send({
      status: "error",
      error: "Not a patient, parent, or social worker.",
    });
  }
});

//Returns constituent info based off Id, lets the frontend know if they are a parent or socialworker
app.get("/", async (req, res) => {
  res.send(await getConstituentFromId(req.query.id));
});

//Returns an object array, using a parent constituent ID, containing all info about a family: all info of parents and patients based off parent ID. First element is patient, rest are parents
app.get("/family", async (req, res) => {
  const parentConstituentId = req.query.id;

  console.log(
    `Starting call to get family info with parentId ${parentConstituentId}\n\n`
  );

  const constituentRelationships = await getConstituentRelationships(
    parentConstituentId,
    req.header
  );

  console.log(
    `Got parent relationships... they are: ${JSON.stringify(
      constituentRelationships
    )}\n\n`
  );

  if (
    constituentRelationships.status &&
    constituentRelationships.status === "error"
  ) {
    res.send(`Error: ${constituentRelationships.message}`);
  }

  const { relation_id: patientId } = constituentRelationships.value.find(
    (relationship) => relationship.reciprocal_type === "Parent"
  );

  console.log(
    `Found the parent relationship with its child and got the id of the patient: ${patientId}\n\n`
  );

  const patientCompleteInfo = await getConstituentFromId(patientId, req.header);

  console.log(
    `Got the patientComplete info: ${JSON.stringify(patientCompleteInfo)}\n\n`
  );

  const patientRelationships = await getConstituentRelationships(
    patientId,
    req.header
  );

  console.log(
    `Got the patient's relationships ${JSON.stringify(
      patientRelationships
    )}\n\n`
  );

  if (patientRelationships.status && patientRelationships.status === "error") {
    res.send(`Error: ${constituentRelationships.message}`);
  }

  let parentId = "";
  let socialWorkerId = "";
  let patientAndSocialWorkerRelationshipId = "";
  let hospitalId = "";
  let patientAndHospitalRelationshipId = "";

  patientRelationships.value.forEach((relationship) => {
    if (relationship.type === "Parent") {
      parentId = relationship.relation_id;
    } else if (relationship.type === "Social Worker") {
      socialWorkerId = relationship.relation_id;
      patientAndSocialWorkerRelationshipId = relationship.id;
    } else if (relationship.type === "Hospital") {
      hospitalId = relationship.relation_id;
      patientAndHospitalRelationshipId = relationship.id;
    }
  });

  console.log("Hospital id: " + hospitalId);

  const returnVal = {
    patient: patientCompleteInfo,
    parent: {},
    socialWorker: {},
    patientDiagnosis: "",
    hospital: "",
    veteran: {},
  };

  returnVal.parent = await getConstituentFromId(parentId, req.header);

  console.log(hospitalId);
  console.log(hospitalId !== "");

  const { name: hospitalName } =
    hospitalId !== "" ? await getConstituentFromId(hospitalId, req.header) : "";
  console.log(`Got hospital's name: ${hospitalName}\n\n`);

  returnVal.hospital = {
    relationshipId: patientAndHospitalRelationshipId,
    value:
      hospitalName !== undefined && hospitalName !== "" ? hospitalName : "",
  };

  console.log(
    `state of returnVal after adding hospital: ${JSON.stringify(returnVal)}\n\n`
  );

  returnVal.socialWorker =
    socialWorkerId !== ""
      ? await getConstituentFromId(socialWorkerId, req.header)
      : "";

  if (socialWorkerId !== "") {
    returnVal.socialWorker.relationshipId =
      patientAndSocialWorkerRelationshipId;
  }

  console.log(
    `state of returnVal after adding socialWorker: ${JSON.stringify(
      returnVal
    )}\n\n`
  );

  let { value: parentCustomFields } = await getCustomFieldList(
    parentId,
    req.header
  );

  let veteranCustomField = parentCustomFields.find(
    (customField) => customField.category === "Veteran"
  );

  returnVal.veteran = {
    id: veteranCustomField.id,
    value: veteranCustomField.value,
  };

  const patientCustomFields = await getCustomFieldList(patientId, req.header);

  console.log(
    `got patient custom fields: ${JSON.stringify(patientCustomFields)}\n\n`
  );

  const diagnosis = patientCustomFields.value.find(
    (obj) => obj.category === "Current Diagnosis"
  );

  console.log(`value of diagnosis: ${diagnosis}\n\n`);

  returnVal.patientDiagnosis = { id: diagnosis.id, value: diagnosis.value };
  console.log(
    `state of returnVal after adding diagnosis and right before sending back returnVal: ${JSON.stringify(
      returnVal
    )}\n\n`
  );

  res.send(returnVal);
});

//Creates a new family
app.post("/family", async (req, res) => {
  console.log("Hit the call to create a new family");
  console.log(`The body of the request: ${JSON.stringify(req.body)}`);
  req.header["Content-Type"] = "application/json";
  //Create patient
  const { id: patientId } = await createConstituent(
    JSON.stringify(req.body.patient),
    req.header
  );

  console.log(`Patient was created with id ${patientId}`);
  //Create parent(s)
  const { id: parentId } = await createConstituent(
    JSON.stringify(req.body.parent),
    req.header
  );

  //Add constituent codes
  await createConstituentCode(
    JSON.stringify({ constituent_id: patientId, description: "Patient" }),
    req.header
  );

  await createConstituentCode(
    JSON.stringify({ constituent_id: parentId, description: "Parent" }),
    req.header
  );

  console.log("constituent codes should have been added");

  //Add relationships to eachother, hospital, and socialworker
  const sonOrDaughter = req.body.patient.gender === "Male" ? "Son" : "Daughter";

  await createRelationship(
    JSON.stringify({
      constituent_id: parentId,
      reciprocal_type: "Parent",
      relation_id: patientId,
      type: sonOrDaughter,
    }),
    req.header
  );

  //Still have to add hospital and social worker relationship need to find out how to; also need to add new constituent codes

  //Adds relationship to hospital

  //Need to see if hospital exists already, if it doesn't create it
  const hospitalInfo = await getConstituentFromName(
    req.body.hospitalName,
    req.header
  );

  console.log(`hospitalinfo is ${JSON.stringify(hospitalInfo)}`);

  const hospitalError =
    hospitalInfo !== undefined &&
    "status" in hospitalInfo &&
    hospitalInfo.status === "error" &&
    hospitalInfo.error === "User not found";

  if (!hospitalError && hospitalInfo !== "Couldn't find constituent") {
    console.log("Adding relationship to hospital");
    const hospitalId = hospitalInfo.id;
    await createRelationship(
      JSON.stringify({
        constituent_id: hospitalId,
        reciprocal_type: "Hospital",
        relation_id: patientId,
        type: "Patient",
      }),
      req.header
    );
  } else {
    const { id: newHospitalId } = await createConstituent(
      JSON.stringify({
        inactive: false,
        name: req.body.hospitalName,
        type: "Organization",
      }),
      req.header
    );

    await createConstituentCode(
      JSON.stringify({
        constituent_id: newHospitalId,
        description: "Hospital",
      }),
      req.header
    );

    await createRelationship(
      JSON.stringify({
        constituent_id: newHospitalId,
        reciprocal_type: "Hospital",
        relation_id: patientId,
        type: "Patient",
      }),
      req.header
    );

    console.log(
      "Should have added constituent code to hospital and relationship with patient for hospital"
    );
  }

  //Adds relationship to social worker

  //Need to see if social worker already exists already, if it doesn't create it and notify the social wokrer they have an account under that email
  const socialWorkerInfo = await getConstituentFromEmail(
    req.body.socialWorkerEmail,
    req.header
  );

  console.log(
    `The social worker info that was returned was ${JSON.stringify(
      socialWorkerInfo
    )}`
  );
  const socialWorkerError =
    socialWorkerInfo !== undefined &&
    "status" in socialWorkerInfo &&
    socialWorkerInfo.status === "error" &&
    socialWorkerInfo.error === "User not found";

  console.log(`Social worker Error value: ${socialWorkerError}`);
  let socialWorkerResponse = "";

  if (!socialWorkerError && socialWorkerInfo !== "Couldn't find constituent") {
    const socialWorkerId = socialWorkerInfo.id;
    console.log("creating relationship with social worker and patient");
    await createRelationship(
      JSON.stringify({
        constituent_id: socialWorkerId,
        reciprocal_type: "Social Worker",
        relation_id: patientId,
        type: "Patient",
      }),
      req.header
    );
  } else {
    console.log("Social worker wasn't found");
    socialWorkerResponse =
      "Social Worker doesn't have an account with us. We have prompted them to create an account with us. Once they do, they will show up in your portal.";
    //Need to send the email to socialWorker to prompt them to create an account.
    sendEmail({
      from: "wadih@codingangel.org",
      to: [req.body.socialWorkerEmail],
      subject: "Social Worker Request",
      text: `A patient has declared you as a social worker and is trying to connect your account on their patient portal.\n\n
      Patient Name: ${req.body.patient.first} ${req.body.patient.last},\n
      Patient Diagnosis: ${req.body.diagnosis},\n
      Patient Hospital: ${req.body.hospitalName}\n\n
      If you believe this to be a mistake, please disregard this email.\n\n
      If you wish to connect with this patient, and create your own account, please copy and paste the following url in your browser:\n\n
      http://localhost:3000/new-s-worker/${patientId}/${req.body.socialWorkerEmail}\n`,
    }).catch((err) => console.log(err));
  }

  //Add diagnosis, and veteran custom fields
  await addCustomField(
    JSON.stringify({
      category: "Current Diagnosis",
      parent_id: patientId,
      value: req.body.diagnosis,
    }),
    req.header
  );

  await addCustomField(
    JSON.stringify({
      category: "Veteran",
      parent_id: parentId,
      value: req.body.veteran,
    }),
    req.header
  );

  console.log(
    `Reached the end of the call and the response should be ${JSON.stringify({
      message: "Successfully made new family",
      socialWorker: socialWorkerResponse,
    })}`
  );

  res.send({
    message: "Successfully made new family",
    socialWorker: socialWorkerResponse,
  });
});

//Updates a parents's info based off their id
app.patch("/updateParent", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  let constituentBody = {
    first: req.body.constituentInfo.first,
    last: req.body.constituentInfo.last,
  };

  let email = req.body.constituentInfo.email;
  let address = req.body.constituentInfo.address;
  let phone = req.body.constituentInfo.phone;
  let customFields = req.body.customFields;

  await updateConstituent(
    req.query.id,
    JSON.stringify(constituentBody),
    req.header
  );

  await updateConstituentEmail(
    email.id,
    JSON.stringify({ address: email.value }),
    req.header
  );

  await updateConstituentAddress(
    address.id,
    JSON.stringify({
      address_lines: address.address_lines,
      city: address.city,
      state: address.state,
      postal_code: address.zip,
      country: address.country,
    }),
    req.header
  );

  await updateConstituentPhone(
    phone.id,
    JSON.stringify({ number: phone.value }),
    req.header
  );

  Promise.all(
    customFields.map(async (customField) => {
      updateConstituentCustomField(
        customField.id,
        JSON.stringify({ value: customField.value }),
        req.header
      );
    })
  ).then(() => res.send({ message: "Success" }));
});

//updates a patient's info based off their id
app.patch("/updatePatient", async (req, res) => {
  console.log(`Starting to update patient`);

  req.header["Content-Type"] = "application/json";

  let constituentBody = {
    first: req.body.constituentInfo.first,
    last: req.body.constituentInfo.last,
    birthdate: {
      d: req.body.constituentInfo.birthdate.d,
      m: req.body.constituentInfo.birthdate.m,
      y: req.body.constituentInfo.birthdate.y,
    },
  };

  console.log(
    `value of request body to update the constituent: ${JSON.stringify(
      constituentBody
    )}\n\n`
  );

  const address = req.body.constituentInfo.address;
  const customFields = req.body.customFields;
  const hospitalRelationship = req.body.hospitalRelationship;
  const socialWorkerRelationship = req.body.socialWorkerRelationship;

  console.log("Updating the constituent...\n\n");

  await updateConstituent(
    req.query.id,
    JSON.stringify(constituentBody),
    req.header
  );

  console.log("Finished updating the constituent\n\n");

  console.log("Starting to update the patient's address...\n\n");
  await updateConstituentAddress(
    address.id,
    JSON.stringify({
      address_lines: address.address_lines,
      city: address.city,
      state: address.state,
      postal_code: address.zip,
      country: address.country,
    }),
    req.header
  );

  console.log("Finished updating the patient's address...\n\n");

  console.log("Starting to update the custom fields...\n\n");
  Promise.all(
    customFields.map(async (customField) => {
      updateConstituentCustomField(
        customField.id,
        JSON.stringify({ value: customField.value }),
        req.header
      );
    })
  );

  console.log("Finished updating the custom fields...\n\n");

  let relationshipMessage = "";

  console.log("Starting to work on the relationships...\n\n");

  console.log(
    `Working on hospital: ${JSON.stringify(hospitalRelationship)}\n\n`
  );

  if (hospitalRelationship.update) {
    console.log("It has been determined that the hospital will be updated\n\n");

    if (hospitalRelationship.relationship_id !== "") {
      console.log(
        "It has been determined that the hospital relationship will be deleted, and a new one will be added. Deleting now...\n\n"
      );
      await deleteRelationship(
        hospitalRelationship.relationship_id,
        req.header
      );
    }
    let hospitalInfo = await getConstituentFromName(
      hospitalRelationship.value,
      req.header
    );
    console.log(
      `The hospitalInfo has been retrieved and it is ${JSON.stringify(
        hospitalInfo
      )}`
    );
    const error =
      hospitalInfo !== undefined &&
      typeof hospitalInfo === "object" &&
      "status" in hospitalInfo &&
      hospitalInfo.status === "error" &&
      hospitalInfo.error === "User not found";

    if (error) {
      console.log(
        `The hospital didn't exist so now we are going to make it and add the new relationship..., relationship message should be ${relationshipMessage}\n\n`
      );
      let { id: newHospitalId } = await createConstituent(
        JSON.stringify({
          inactive: false,
          name: hospitalRelationship.value,
          type: "Organization",
        }),
        req.header
      );

      console.log(
        `The new hospital has been created and the id is: ${newHospitalId}\n\n`
      );

      console.log("Creating the constituent code...\n\n");

      await createConstituentCode(
        JSON.stringify({
          constituent_id: newHospitalId,
          description: "Hospital",
        }),
        req.header
      );

      console.log("Finished creating the constituent code...\n\n");

      console.log(
        `the new hospital has been created and we are creating the relationship`
      );

      await createRelationship(
        JSON.stringify({
          constituent_id: newHospitalId,
          reciprocal_type: "Hospital",
          relation_id: req.query.id,
          type: "Patient",
        }),
        req.header
      );
    } else {
      console.log(
        `The hospital existed and we are creating the relationship\n\n`
      );
      await createRelationship(
        JSON.stringify({
          constituent_id: hospitalInfo.id,
          reciprocal_type: "Hospital",
          relation_id: req.query.id,
          type: "Patient",
        }),
        req.header
      );
    }
  }

  console.log(
    `Working on social Worker: ${JSON.stringify(socialWorkerRelationship)}\n\n`
  );

  if (socialWorkerRelationship.update) {
    if (socialWorkerRelationship.relation_id !== "") {
      console.log(
        "It has been determined that the socialWorker relationship will be deleted, and a new one will be added. Deleting now...\n\n"
      );
      await deleteRelationship(
        socialWorkerRelationship.relationship_id,
        req.header
      );
    }

    let socialWorkerInfo = await getConstituentFromEmail(
      socialWorkerRelationship.value,
      req.header
    );

    let socialWorkerConstituentCode;

    if (socialWorkerInfo !== undefined && "error" in socialWorkerInfo) {
      socialWorkerConstituentCode = "User wasn't found";
    } else {
      let { value: socialWorkerConstituentCodes } =
        await getConsituentCodeListFromId(socialWorkerInfo.id, req.header);
      socialWorkerConstituentCode = socialWorkerConstituentCodes.find(
        (code) => code.description === "Social Worker"
      );
    }

    console.log(
      `Retrieved the social worker's info and it is: ${JSON.stringify(
        socialWorkerInfo
      )}\n\n`
    );

    const error =
      socialWorkerInfo !== undefined &&
      typeof socialWorkerInfo === "object" &&
      "status" in socialWorkerInfo &&
      socialWorkerInfo.status === "error" &&
      socialWorkerInfo.error === "User not found";

    if (error) {
      console.log(
        `The social worker couldn't be found so not adding anything and sending back no update... the value of relationshipMessage should be: ${relationshipMessage}\n\n`
      );
      relationshipMessage +=
        "Social worker couldn't be found, sent an email for them to create an account, once they do they will show up on your portal.\n\n";
        sendEmail({
          from: "wadih@codingangel.org",
          to: [socialWorkerRelationship.value],
          subject: "Social Worker Request",
          text: `A patient has declared you as a social worker and is trying to connect your account on their patient portal.\n\n
          Patient Name: ${req.body.constituentInfo.first} ${req.body.constituentInfo.last},\n
          Patient Diagnosis: ${req.body.customFields[0].value},\n
          Patient Hospital: ${hospitalRelationship.value}\n\n
          If you believe this to be a mistake, please disregard this email.\n\n
          If you wish to connect with this patient, and create your own account, please copy and paste the following url in your browser:\n\n
          http://localhost:3000/new-s-worker/${req.query.id}/${socialWorkerRelationship.value}\n`,
        }).catch((err) => console.log(err));
    } else if (
      socialWorkerConstituentCode === "User wasn't found" ||
      socialWorkerConstituentCode === undefined
    ) {
      relationshipMessage +=
        "Email provided wasn't a social worker, please provide an email of a valid social worker.\n\n";
    } else {
      console.log(
        `The social worker was found, creating the relationship...\n\n`
      );
      await createRelationship(
        JSON.stringify({
          constituent_id: socialWorkerInfo.id,
          reciprocal_type: "Social Worker",
          relation_id: req.query.id,
          type: "Patient",
        }),
        req.header
      );
    }
  }
  res.send({ message: relationshipMessage });
});

//Get a social worker's info for the portal based off id
app.get("/socialWorker", async (req, res) => {
  console.log("Hit call to find social worker...\n\n");
  const socialWorkerId = req.query.id;
  const socialWorkerCompleteInfo = await getConstituentFromId(
    socialWorkerId,
    req.header
  );
  console.log(
    `Complete info of social worker found: ${JSON.stringify(
      socialWorkerCompleteInfo
    )}\n\n`
  );
  const { value: socialWorkerRelationships } =
    await getConstituentRelationships(socialWorkerId, req.header);

  const hospitalRelationship = socialWorkerRelationships.find(
    (relationship) => relationship.type === "Hospital"
  );

  console.log(
    `sending back: ${JSON.stringify({
      first: socialWorkerCompleteInfo.first,
      last: socialWorkerCompleteInfo.last,
      email: {
        id: socialWorkerCompleteInfo.email.id,
        value: socialWorkerCompleteInfo.email.address,
      },
      hospital:
        hospitalRelationship !== undefined
          ? { id: hospitalRelationship.id, value: hospitalRelationship.name }
          : { id: "", value: "" },
    })}\n\n`
  );

  res.send({
    first: socialWorkerCompleteInfo.first,
    last: socialWorkerCompleteInfo.last,
    email: {
      id: socialWorkerCompleteInfo.email.id,
      value: socialWorkerCompleteInfo.email.address,
    },
    hospital:
      hospitalRelationship !== undefined
        ? { id: hospitalRelationship.id, value: hospitalRelationship.name }
        : { id: "", value: "" },
  });
});

// Gets an array of all patients of a social worker based off the social worker id
app.get("/socialWorker/patients", async (req, res) => {
  let returnVal = [];
  let patientIds = [];
  const socialWorkerId = req.query.id;

  const { value: relationships } = await getConstituentRelationships(
    socialWorkerId,
    req.header
  );

  relationships.forEach((relationship) => {
    console.log(JSON.stringify(relationship));
    if (relationship.type === "Patient") {
      patientIds.push(relationship.relation_id);
    }
  });

  console.log(patientIds);

  const socialWorkerInfo = await getConstituentFromId(
    socialWorkerId,
    req.header
  );

  Promise.all(
    patientIds.map(async (patientId) => {
      const patientInfo = await getConstituentFromId(patientId, req.header);

      const { value: patientCustomFields } = await getCustomFieldList(
        patientId,
        req.header
      );

      const patientDiagnosis = patientCustomFields.find(
        (customField) => customField.category === "Current Diagnosis"
      );

      console.log(`Diagnosis: ${JSON.stringify(patientDiagnosis)}`);
      
      const {value: patientRelationships} = await getConstituentRelationships(patientId, req.header);

      const hospital = patientRelationships.find(
        (relationship) => relationship.type === "Hospital"
      );

      console.log(`Hospital: ${JSON.stringify(hospital)}`);
      const socialWorkerRelationshipToPatient = relationships.find(
        (relationship) => relationship.type === "Patient"
      );
      console.log(
        `relationship w social worker and patient: ${JSON.stringify(
          socialWorkerRelationshipToPatient
        )}`
      );

      patientInfo.diagnosis = {
        id: patientDiagnosis.id,
        value: patientDiagnosis.value,
      };


      patientInfo.hospital = hospital !== undefined ? { id: hospital.id, value: hospital.name } : { id: "", value: "" };

      patientInfo.socialWorker = {
        name: `${socialWorkerInfo.first} ${socialWorkerInfo.last}`,
        email: socialWorkerInfo.email.address,
        relationshipId: socialWorkerRelationshipToPatient.id,
      };

      return patientInfo;
    })
  )
    .then((values) => {
      values.forEach((value) => returnVal.push(value));
    })
    .then(() => res.send({ patients: returnVal }));
});

//Deletes a relationship between social worker and patient
app.delete("/socialWorker/deletePatient", (req, res) => {
  const idOfRelationship = req.query.id;
  deleteRelationship(idOfRelationship, req.header).then(() =>
    res.send({ message: "Success" })
  );
});

//Creates a social worker account
app.post("/socialWorker/create", async (req, res) => {
  const patientId = req.query.id;
  req.header["Content-Type"] = "application/json";
  const { id: newSocialWorkerId } = await createConstituent(
    JSON.stringify({
      first: req.body.first,
      last: req.body.last,
      email: {
        address: req.body.email,
        type: "Email",
      },
      type: "Individual",
      inactive: false
    }),
    req.header
  );

  await createConstituentCode(
    JSON.stringify({
      constituent_id: newSocialWorkerId,
      description: "Social Worker",
    }),
    req.header
  );

  await createRelationship(
    JSON.stringify({
      constituent_id: patientId,
      reciprocal_type: "Patient",
      relation_id: newSocialWorkerId,
      type: "Social Worker",
    }),
    req.header
  );

  let hospitalInfo = await getConstituentFromName(
    req.body.hospital,
    req.header
  );

  console.log(
    `The hospitalInfo has been retrieved and it is ${JSON.stringify(
      hospitalInfo
    )}`
  );
  const error =
    hospitalInfo !== undefined &&
    typeof hospitalInfo === "object" &&
    "status" in hospitalInfo &&
    hospitalInfo.status === "error" &&
    hospitalInfo.error === "User not found";

  if (error) {
    let { id: newHospitalId } = await createConstituent(
      JSON.stringify({
        inactive: false,
        name: req.body.hospital,
        type: "Organization",
      }),
      req.header
    );

    console.log(
      `The new hospital has been created and the id is: ${newHospitalId}\n\n`
    );

    console.log("Creating the constituent code...\n\n");

    await createConstituentCode(
      JSON.stringify({
        constituent_id: newHospitalId,
        description: "Hospital",
      }),
      req.header
    );

    console.log("Finished creating the constituent code...\n\n");

    console.log(
      `the new hospital has been created and we are creating the relationship`
    );

    await createRelationship(
      JSON.stringify({
        constituent_id: newHospitalId,
        reciprocal_type: "Hospital",
        relation_id: newSocialWorkerId,
        type: "Social Worker",
      }),
      req.header
    );
  } else {
    console.log(
      `The hospital existed and we are creating the relationship\n\n`
    );
    await createRelationship(
      JSON.stringify({
        constituent_id: hospitalInfo.id,
        reciprocal_type: "Hospital",
        relation_id: newSocialWorkerId,
        type: "Social Worker",
      }),
      req.header
    );
  }

  res.send({message: "Success"});
});

//Updates a social worker's info
app.patch("/socialWorker/updateInfo", async (req, res) => {
  req.header["Content-Type"] = "application/json";

  let email = req.body.email;
  let hospitalRelationship = req.body.hospital;

  let constituentBody = {
    first: req.body.first,
    last: req.body.last,
  };

  //Updates the constituent

  await updateConstituent(
    req.query.id,
    JSON.stringify(constituentBody),
    req.header
  );

  //Updates the email
  await updateConstituentEmail(
    email.id,
    JSON.stringify({ address: email.value }),
    req.header
  );

  //Updates the hospital
  if (hospitalRelationship.update) {
    console.log("It has been determined that the hospital will be updated\n\n");
    console.log(hospitalRelationship.relation_id);
    if (hospitalRelationship.relation_id !== "") {
      console.log(
        "It has been determined that the hospital relationship will be deleted, and a new one will be added. Deleting now...\n\n"
      );
      await deleteRelationship(
        hospitalRelationship.relationship_id,
        req.header
      );
    }

    let hospitalInfo = await getConstituentFromName(
      hospitalRelationship.value,
      req.header
    );
    console.log(
      `The hospitalInfo has been retrieved and it is ${JSON.stringify(
        hospitalInfo
      )}`
    );
    const error =
      hospitalInfo !== undefined &&
      typeof hospitalInfo === "object" &&
      "status" in hospitalInfo &&
      hospitalInfo.status === "error" &&
      hospitalInfo.error === "User not found";

    if (error) {
      let { id: newHospitalId } = await createConstituent(
        JSON.stringify({
          inactive: false,
          name: hospitalRelationship.value,
          type: "Organization",
        }),
        req.header
      );

      console.log(
        `The new hospital has been created and the id is: ${newHospitalId}\n\n`
      );

      console.log("Creating the constituent code...\n\n");

      await createConstituentCode(
        JSON.stringify({
          constituent_id: newHospitalId,
          description: "Hospital",
        }),
        req.header
      );

      console.log("Finished creating the constituent code...\n\n");

      console.log(
        `the new hospital has been created and we are creating the relationship`
      );

      await createRelationship(
        JSON.stringify({
          constituent_id: newHospitalId,
          reciprocal_type: "Hospital",
          relation_id: req.query.id,
          type: "Social Worker",
        }),
        req.header
      );
    } else {
      console.log(
        `The hospital existed and we are creating the relationship\n\n`
      );
      await createRelationship(
        JSON.stringify({
          constituent_id: hospitalInfo.id,
          reciprocal_type: "Hospital",
          relation_id: req.query.id,
          type: "Social Worker",
        }),
        req.header
      );
    }
  }

  res.send({ message: "Success" });
});

//Returns whether a constituent already exists by email
app.get("/constituentExists", async (req, res) => {
  const email = req.query.email;

  let constituentResult = await getConstituentFromEmail(email, req.header);

  let constituentExists = constituentResult !== undefined && "id" in constituentResult;

  res.send({constituentExists: constituentExists});
})

module.exports = app;
