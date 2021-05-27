//Set up stuff
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
const app = express();
const url = require("url").URL;

const port = process.env.PORT || 5000;
const DB_PASS = process.env.DB_PASS;
const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;
const uri = `mongodb+srv://wadih:${DB_PASS}@clusterllb.auwn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database, collection;

//Helper functions

//Converts an object to FormURLEncoded string
function objToFormURLEncoded(obj) {
  var formBody = [];
  for (var property in obj) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(obj[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return formBody;
}

//updates the access token, refresh token, and their expiration dates in MongoDB
const updateToken = (refresh, access, refreshExpire, accessExpire) => {
  return new Promise((resolve, reject) => {
    let refreshTimeInSeconds = Date.now() + refreshExpire * 1000;
    let accessTimeInSeconds = Date.now() + accessExpire * 1000;
    collection
      .updateOne(
        { purpose: "oauth" },
        {
          $set: {
            access_token: access,
            access_expires_on: accessTimeInSeconds,
            refresh_token: refresh,
            refresh_expires_on: refreshTimeInSeconds,
          },
        }
      )
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Gets the refresh token from MongoDB
function getValidRefreshToken() {
  return new Promise(async (resolve, reject) => {
    let oauthInfo = await collection
      .findOne({ purpose: "oauth" })
      .catch((err) => {
        return reject(err);
      });
    resolve(oauthInfo.refresh_token);
  });
}

// Gets a new access token from SKY API and updates it in MongoDB
function refreshAccessToken() {
  return new Promise(async (resolve, reject) => {
    let newAccessToken;
    let body = {
      grant_type: "refresh_token",
      refresh_token: await getValidRefreshToken().catch((err) => {
        return reject(err);
      }),
    };
    let headers = {
      Authorization: `Basic ${AUTHORIZATION}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    fetch("https://oauth2.sky.blackbaud.com/token", {
      method: "POST",
      body: objToFormURLEncoded(body),
      headers: headers,
    })
      .then((res) => res.json())
      .then(async (res) => {
        let refreshToken = res.refresh_token;
        newAccessToken = res.access_token;
        let refreshExpiresIn = res.refresh_token_expires_in;
        let accessExpiresIn = res.expires_in;
        await updateToken(
          refreshToken,
          newAccessToken,
          refreshExpiresIn,
          accessExpiresIn
        )
          .then(() => {
            resolve(newAccessToken);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//Calls the sky api endpoint to get the constituent matching the email address. Returns basic constituent info
const getConstituentFromEmail = (email, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/search?search_text=${email}`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else if (response.count <= 0) {
          resolve({ status: "error", error: "User not found" });
        } else {
          const rightConstituent = response.value.find(
            (constituent) => constituent.email === email
          );

          if (rightConstituent !== undefined) {
            resolve(rightConstituent);
          } else {
            resolve("Couldn't find constituent");
          }
        }
      })
      .catch((error) => console.log(error));
  });
};

//Gets basic constituent info based off name
const getConstituentFromName = (name, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      new url(
        `https://api.sky.blackbaud.com/constituent/v1/constituents/search?search_text=${name}`
      ),
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else if (response.count <= 0) {
          resolve({ status: "error", error: "User not found" });
        } else {
          const firstWordInName = name.split(" ")[0];

          const rightConstituent = response.value.find(
            (constituent) => constituent.name.indexOf(firstWordInName) !== -1
          );

          if (rightConstituent !== undefined) {
            resolve(rightConstituent);
          } else {
            resolve("Couldn't find constituent");
          }
        }
      });
  });
};

//Gets constituent from SKY Api based on their constituent ID
const getConstituentFromId = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.statusCode !== undefined && response.statusCode !== 200) {
          resolve({ status: "error", error: response.message });
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Gets a list of constituent codes pertaining to the constituent that matches the id passed
const getConsituentCodeListFromId = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/constituentcodes`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200)
            resolve({ status: "error", error: response.message });
        } else {
          resolve(response);
        }
      });
  });
};

//Deletes a service
const deleteAction = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/actions/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then(() => resolve("successfully deleted action"))
      .catch((err) => reject(err));
  });
};

//Gets the access token from MongoDB if it is valid, if not, gets a new one from SKY API and updates it in Mongo and returns new access token
function getValidAccessToken() {
  return new Promise(async (resolve, reject) => {
    let accessToken;
    let accessExpiresOn;
    const result = await collection
      .findOne({ purpose: "oauth" })
      .catch((err) => {
        console.log(err);
        reject(err);
      });

    accessToken = result.access_token;
    accessExpiresOn = result.access_expires_on;

    let fiveMinBeforeExpire = accessExpiresOn - 300000;

    if (Date.now() >= fiveMinBeforeExpire) {
      let accessTokenRefreshed = await refreshAccessToken().catch((err) => {
        console.log(err);
        reject(err);
      });
      resolve(accessTokenRefreshed);
    } else {
      resolve(accessToken);
    }
  });
}

// gets all the relationships of a constituent based off id
const getConstituentRelationships = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/relationships`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200)
            resolve({ status: "error", error: response.message });
        } else {
          resolve(response);
        }
      });
  });
};

//gets all actions from a constituent

const getAllActions = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/actions`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200)
            resolve({ status: "error", error: response.message });
        } else {
          resolve(response);
        }
      })
      .catch((error) => reject(error));
  });
};

//Creates a constituent and returns the id of the new constituent
const createConstituent = (cObj, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/constituents", {
      method: "POST",
      headers: headers,
      body: cObj,
    })
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Creates a relationship between two constituents
const createRelationship = (reqBody, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/relationships", {
      method: "POST",
      headers: headers,
      body: reqBody,
    })
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Updates a constituent's info
const updateConstituent = (id, reqBodyObj, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}`, {
      method: "PATCH",
      headers: headers,
      body: reqBodyObj,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

//Updates a LLB Service
const updateService = (idOfAction, body, headers) => {
  console.log(`updating service with id: ${idOfAction}, body: ${body}`);
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/actions/${idOfAction}`,
      {
        method: "PATCH",
        headers: headers,
        body: body,
      }
    )
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

//Creates a LLB Service
const createService = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/actions", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Gives a constituent a constituetn code
const createConstituentCode = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/constituentcodes", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Adds a custom field to a constituent
const addCustomField = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      "https://api.sky.blackbaud.com/constituent/v1/constituents/customfields",
      {
        method: "POST",
        headers: headers,
        body: body,
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Gets custom field of constituent

const getCustomFieldList = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/customfields`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//gets all custom fields of an action
const getCustomFieldsAction = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/actions/${id}/customfields`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Adds a custom field to an action
const addActionCustomField = (body, headers) => {
  console.log(body);
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/actions/customfields", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((res) => res.json())
      .then((response) => {
        if ("statusCode" in response) {
          if (response.statusCode !== 200) {
            resolve({ status: "error", error: response.message });
          }
        } else {
          resolve(response);
        }
      })
      .catch((err) => reject(err));
  });
};

//Updates a custom field of an action
const updateActionCustomField = (id, body, headers) => {
  console.log(`body of request: ${body}, id: ${id}`);

  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/actions/customfields/${id}`,
      {
        method: "PATCH",
        headers: headers,
        body: body,
      }
    )
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

//Updates a custom field of a constituent
const updateConstituentCustomField = (id, body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/constituents/customfields/${id}`,
      {
        method: "PATCH",
        body: body,
        headers: headers,
      }
    )
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};
//Updates the address of a constituent
const updateConstituentAddress = (id, body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/addresses/${id}`, {
      method: "PATCH",
      body: body,
      headers: headers,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};
//Updates the phone of aconstituent
const updateConstituentPhone = (id, body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/phones/${id}`, {
      method: "PATCH",
      body: body,
      headers: headers,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};
//Updates the email of a constituent
const updateConstituentEmail = (id, body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/emailaddresses/${id}`, {
      method: "PATCH",
      body: body,
      headers: headers,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

//deletes a relationship based off the relationshipid
const deleteRelationship = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/relationships/${id}`, {
      method: "DELETE",
      headers: headers,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};
//Middleware

//Adds SKY Api required headers to header of each request
app.use(async (req, res, next) => {
  req.header = {
    "Content-Type": "",
    "Bb-Api-Subscription-Key": SUBSCRIPTION_KEY,
    Authorization: `Bearer ${await getValidAccessToken()}`,
  };
  next();
});

//Parses the request body to Json
app.use(express.json());

//Route Handlers
app.get("/", (req, res) => {
  console.log("initial call");
  res.send("Initial Call");
});

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

  if (parentIndex !== -1) {
    res.redirect(`/p-portal/${constituentInfo.id}`);
  } else if (socialWorkerIndex !== -1) {
    res.redirect(`/s-portal/${constituentInfo.id}`);
  } else {
    res.send({
      status: "error",
      error: "Not a patient, parent, or social worker.",
    });
  }
});

//Returns constituent info based off Id, lets the frontend know if they are a parent or socialworker
app.get("/constituent", async (req, res) => {
  res.send(await getConstituentFromId(req.query.id));
});

//Returns an object array, using a parent constituent ID, containing all info about a family: all info of parents and patients based off parent ID. First element is patient, rest are parents
app.get("/constituent/family", async (req, res) => {
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

  const parentIds = [];
  let socialWorkerId = "";
  let patientAndSocialWorkerRelationshipId = "";
  let hospitalId = "";
  let patientAndHospitalRelationshipId = "";

  patientRelationships.value.forEach((relationship) => {
    if (relationship.type === "Parent") {
      parentIds.push(relationship.relation_id);
    } else if (relationship.type === "Social Worker") {
      socialWorkerId = relationship.relation_id;
      patientAndSocialWorkerRelationshipId = relationship.id;
    } else if (relationship.type === "Hospital") {
      hospitalId = relationship.relation_id;
      patientAndHospitalRelationshipId = relationship.id;
    }
  });

  console.log("Hospital id: " + hospitalId);
  console.log(
    `Set the value of parentIds, socialWorkerId, and hospitalId\n\nparentIds: ${parentIds}\n\nsocialWorkerId: ${socialWorkerId}\n\nhospitalId: ${hospitalId}\n\n`
  );

  const returnVal = {
    patient: patientCompleteInfo,
    parents: [],
    socialWorker: {},
    patientDiagnosis: "",
    hospital: "",
    veteran: [],
  };

  console.log(`initial state of returnVal: ${JSON.stringify(returnVal)}\n\n`);
  await Promise.all(
    parentIds.map(async (id) => getConstituentFromId(id, req.header))
  ).then((values) => {
    values.forEach((value) => returnVal.parents.push(value));
  });
  console.log(
    `state of returnVal after adding parents: ${JSON.stringify(returnVal)}\n\n`
  );

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
  await Promise.all(
    parentIds.map(async (id) => getCustomFieldList(id, req.header))
  ).then((values) => {
    values.forEach((value) => {
      const veteranObj = value.value.find(
        (customFieldObj) => customFieldObj.category === "Veteran"
      );
      returnVal.veteran.push({ id: veteranObj.id, value: veteranObj.value });
    });
  });
  console.log(
    `state of returnVal after adding veterans: ${JSON.stringify(returnVal)}\n\n`
  );

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

//Gets all services pertaining to a patient based off their id
app.get("/constituent/services", async (req, res) => {
  const actionsResponse = await getAllActions(req.query.id, req.header);
  const actions = actionsResponse.value;

  Promise.all(
    actions.map(async (action, i) => {
      console.log(`Working on ${i} action\n\n`);
      const { value: customFields } = await getCustomFieldsAction(
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

//Creates a new family
app.post("/constituent/family", async (req, res) => {
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
  const parentIds = [];

  await Promise.all(
    req.body.parents.map(async (parent) =>
      createConstituent(JSON.stringify(parent), req.header)
    )
  ).then((values) => {
    console.log(`Parents were created with ids ${JSON.stringify(values)}`);
    values.forEach((value) => parentIds.push(value));
  });

  //Add constituent codes
  await createConstituentCode(
    JSON.stringify({ constituent_id: patientId, description: "Patient" }),
    req.header
  );

  await Promise.all(
    parentIds.map(async (idObj) =>
      createConstituentCode(
        JSON.stringify({ constituent_id: idObj.id, description: "Parent" }),
        req.header
      )
    )
  );

  console.log("constituent codes should have been added");

  //Add relationships to eachother, hospital, and socialworker
  const sonOrDaughter = req.body.patient.gender === "Male" ? "Son" : "Daughter";

  await Promise.all(
    parentIds.map(async (idObj) =>
      createRelationship(
        JSON.stringify({
          constituent_id: idObj.id,
          reciprocal_type: "Parent",
          relation_id: patientId,
          type: sonOrDaughter,
        }),
        req.header
      )
    )
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
    hospitalInfo !== undefined &&
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
      "Social Worker doesn't have an account with us. We have prompted them to create an account with us. Once they do you can add them in your portal.";
    //Need to send the email to socialWorker to prompt them to create an account.
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

  await Promise.all(
    parentIds.map(async (idObj, i) =>
      addCustomField(
        JSON.stringify({
          category: "Veteran",
          parent_id: idObj.id,
          value: req.body.veteran[i],
        }),
        req.header
      )
    )
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

//Updates a constituent's info based off the constituent Id
app.patch("/constituent/update", async (req, res) => {
  console.log("Started updating");
  req.header["Content-Type"] = "application/json";
  let constituentBody = {};
  const email =
    req.body.constituentInfo.email !== undefined
      ? req.body.constituentInfo.email
      : undefined;
  const address =
    req.body.constituentInfo.address !== undefined
      ? req.body.constituentInfo.address
      : undefined;
  const phone =
    req.body.constituentInfo.phone !== undefined
      ? req.body.constituentInfo.phone
      : undefined;

  const customFields =
    req.body.customFields !== undefined ? req.body.customFields : undefined;
  const relationships =
    req.body.relationships !== undefined ? req.body.relationships : undefined;

  if (req.body.type === "Parent") {
    constituentBody = {
      first: req.body.constituentInfo.first,
      last: req.body.constituentInfo.last,
    };
  } else if (req.body.type === "Patient") {
    constituentBody = {
      first: req.body.constituentInfo.first,
      last: req.body.constituentInfo.last,
      birthdate: {
        d: req.body.constituentInfo.birthdate.d,
        m: req.body.constituentInfo.birthdate.m,
        y: req.body.constituentInfo.birthdate.y,
      },
    };
  }

  await updateConstituent(
    req.query.id,
    JSON.stringify(constituentBody),
    req.header
  );

  if (email !== undefined) {
    await updateConstituentEmail(
      email.id,
      JSON.stringify({ address: email.value }),
      req.header
    );
  }

  if (phone !== undefined) {
    await updateConstituentPhone(
      phone.id,
      JSON.stringify({ number: phone.value }),
      req.header
    );
  }

  if (address !== undefined) {
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
  }

  if (customFields !== undefined) {
    Promise.all(
      customFields.map(async (customField) => {
        updateConstituentCustomField(
          customField.id,
          JSON.stringify({ value: customField.value }),
          req.header
        );
      })
    );
  }

  let relationshipMessage = "";

  if (relationships !== undefined) {
    Promise.all(
      relationships.map(async (relationship) => {
        console.log(
          `working on relationship: ${JSON.stringify(relationship)}\n\n`
        );
        if (!relationship.update) {
          console.log(`the relationship is not gonna update\n\n`);
          return "no update";
        }

        //Delete the relationship
        if (relationship.relationship_id !== "") {
          console.log(
            `deleting the relationship because the relationship_id exists\n\n`
          );
          deleteRelationship(relationship.relationship_id, req.header);
        }

        let newConstituent = "";

        if (relationship.methodToGetNewConstituent === "name") {
          console.log(`getting the constituent by name\n\n`);
          newConstituent = await getConstituentFromName(
            relationship.value,
            req.header
          );
          newConstituent = newConstituent.id;
        } else if (relationship.methodToGetNewConstituent === "email") {
          console.log(`getting the constituent by email\n\n`);
          newConstituent = await getConstituentFromEmail(
            relationship.value,
            req.header
          );
          newConstituent = newConstituent.id;
        } else {
          console.log(
            `method to get the constituent wasn't supplied, not updating\n\n`
          );
          return "no update";
        }

        const constituentError =
          newConstituent !== undefined &&
          typeof newConstituent === "object" &&
          "status" in newConstituent &&
          newConstituent.status === "error" &&
          newConstituent.error === "User not found";

        if (constituentError) {
          if (relationship.reciprocal_type === "Hospital") {
            console.log(
              `Hospital couldn't be found so now it is being created\n\n`
            );
            createConstituent(
              JSON.stringify({
                inactive: false,
                name: req.body.hospitalName,
                type: "Organization",
              }),
              req.header
            )
              .then((response) => response.json())
              .then((response) => (newConstituent = response.id))
              .then(async (response) => {
                console.log(`adding the new hospital's constituent code\n\n`);
                await createConstituentCode(
                  JSON.stringify({
                    constituent_id: response.id,
                    description: "Hospital",
                  }),
                  req.header
                );
              });
          } else if (relationship.reciprocal_type === "Social Worker") {
            console.log(
              `The social worker wasn't found so adding a message to display back to user\n\n`
            );
            relationshipMessage +=
              "This social worker wasn't found in our system, we sent an email to them prompting them to create an account. Try again soon.\n";
            return "no update";
          }
        }
        console.log(
          `should add ${JSON.stringify({
            type: relationship.type,
            reciprocal_type: relationship.reciprocal_type,
            id: newConstituent,
          })}`
        );
        return {
          type: relationship.type,
          reciprocal_type: relationship.reciprocal_type,
          id: newConstituent,
        };
      })
    )
      .then((values) => {
        console.log("Finished first promise all moving to the next...\n\n");
        Promise.all(
          values.map(async (value) => {
            console.log(`working on the update ${value}\n\n`);
            if (value === "no update") {
              console.log(`there was no update \n\n`);
              return "no update";
            }
            console.log(
              `Program determined a new relationship should be created and it is doing that right now.\n\n`
            );

            await createRelationship(
              JSON.stringify({
                constituent_id: value.id,
                reciprocal_type: value.reciprocal_type,
                relation_id: req.query.id,
                type: value.type,
              }),
              req.header
            );
          })
        );
      })
      .then(() => res.send({ redirect: true, message: relationshipMessage }));
  }
});

//Updates a LLB Service based off the service's id
app.patch("/service/update", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  var body = JSON.stringify({
    description: req.body.additionalNotes,
    type: req.body.typeOfAssistance.value,
  });

  await updateService(req.query.id, body, req.header);

  await updateActionCustomField(
    req.body.preferredRetailer.id,
    JSON.stringify({
      value: req.body.preferredRetailer.value,
    }),
    req.header
  );

  res.send({ message: "Success" });
});

//Creates a LLB Service and sends back the id of the new action
app.post("/service/create", async (req, res) => {
  console.log("starting to create service");
  req.header["Content-Type"] = "application/json";
  const patientId = req.query.patientId;
  const parentId = req.query.parentId;
  const date = new Date();
  date.toISOString();
  const reqBody = {
    category: "Task/Other",
    constituent_id: patientId,
    date: date,
    description: req.body.additionalNotes,
    type: req.body.typeOfAssistance,
  };
  const { id: newActionId } = await createService(
    JSON.stringify(reqBody),
    req.header
  );

  const customFieldActionId = await addActionCustomField(
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

  res.redirect(`/p-portal/${parentId}/services?patientId=${patientId}`);
});

//Deletes a service
app.delete("/service/delete", (req, res) => {
  const idOfAction = req.query.id;
  deleteAction(idOfAction, req.header).then((response) =>
    res.send({ message: response })
  );
});

//Starts server
const start = async () => {
  try {
    client.connect().then(() => {
      console.log("CONNECTED TO MONGODB!");
      database = client.db("llb");
      collection = database.collection("admin");
    });
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    await client.close();
    console.log("APPLICATION ERROR! ", error.toString());
  }
};

start();
