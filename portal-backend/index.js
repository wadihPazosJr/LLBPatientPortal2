//Set up stuff
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
const app = express();



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
    
        let refreshTimeInSeconds = Date.now() + (refreshExpire*1000);
        let accessTimeInSeconds = Date.now() + (accessExpire*1000);
        collection
        .updateOne({ purpose: "oauth" }, { $set: { access_token: access, access_expires_on: accessTimeInSeconds, refresh_token: refresh, refresh_expires_on: refreshTimeInSeconds} })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
};

//Gets the refresh token from MongoDB
function getValidRefreshToken(){
  return new Promise(async (resolve, reject) => {
    let oauthInfo = await collection.findOne({purpose: "oauth"}).catch((err) => {
      return reject(err);
    })
    resolve(oauthInfo.refresh_token)
  })
    
}


// Gets a new access token from SKY API and updates it in MongoDB
function refreshAccessToken(){
  return new Promise(async (resolve, reject) => {
    let newAccessToken;
    let body = {
        grant_type: "refresh_token",
        refresh_token: await getValidRefreshToken().catch((err) => {
          return reject(err);
        })
      };
      let headers = {
        Authorization: `Basic ${AUTHORIZATION}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };

    fetch("https://oauth2.sky.blackbaud.com/token", {
        method: "POST",
        body: objToFormURLEncoded(body),
        headers: headers
    })
    .then(res => res.json())
    .then(async (res) => {
        let refreshToken = res.refresh_token;
        newAccessToken = res.access_token;
        let refreshExpiresIn = res.refresh_token_expires_in;
        let accessExpiresIn = res.expires_in;
        await updateToken(refreshToken, newAccessToken, refreshExpiresIn, accessExpiresIn)
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
  })
}

//Calls the sky api endpoint to get the constituent matching the email address. Returns basic constituent info
const getConstituentFromEmail = (email, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/search?search_text=${email}`, {
      method: "GET",
      headers: headers
    })
    .then((response) => response.json())
    .then((response) => {
      if("statusCode" in response) {
        if(response.statusCode !== 200)
        {
          resolve({status: "error", error: response.message})
        }
      }
      else if (response.count <= 0) {
        resolve({status: "error", error: "User not found"})
      }
      else {
        let constituentInfo = response.value.find(obj => {
          return obj.email === email;
        })
        resolve(constituentInfo);
      }
    })
  })
}

//Gets basic constituent info based off name
const getConstituentFromName = (name, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/search?search_text=${name}`, {
      method: "GET",
      headers: headers
    })
    .then((response) => response.json())
    .then((response) => {
      if("statusCode" in response) {
        if(response.statusCode !== 200)
        {
          resolve({status: "error", error: response.message})
        }
      }
      else if (response.count <= 0) {
        resolve({status: "error", error: "User not found"})
      }
      else {
        let constituentInfo = response.value.find(obj => {
          return obj.name === name;
        })
        resolve(constituentInfo);
      }
    })
  })
}

//Gets constituent from SKY Api based on their constituent ID
const getConstituentFromId = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/`, {
      method: "GET",
      headers: headers
    })
    .then(response => response.json())
    .then(response => {
      if(response.statusCode !== undefined && response.statusCode !== 200) {
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
    .catch(err => reject(err))
  })
  }

//Gets a list of constituent codes pertaining to the constituent that matches the id passed
const getConsituentCodeListFromId = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/constituentcodes`, {
      method: "GET",
      headers: headers
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200)
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
  })
}

//Gets the access token from MongoDB if it is valid, if not, gets a new one from SKY API and updates it in Mongo and returns new access token
function getValidAccessToken(){
  return new Promise(async (resolve, reject) => {
    let accessToken;
    let accessExpiresOn;
    const result = await collection.findOne({purpose: "oauth"}).catch((err) => {
      console.log(err);
      reject(err);
    });

    
    accessToken = result.access_token;
    accessExpiresOn = result.access_expires_on;

    let fiveMinBeforeExpire = accessExpiresOn - 300000;


    if(Date.now() >= fiveMinBeforeExpire)
    {
        
        let accessTokenRefreshed = await refreshAccessToken().catch( err => {
          console.log(err);
          reject(err);
        });
        resolve(accessTokenRefreshed);
    }
    else
    {
        resolve(accessToken);
    }
  }).catch(error => reject(error))
}

// gets all the relationships of a constituent based off id
const getConstituentRelationships = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/relationships`, {
      method: "GET",
      headers: headers
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200)
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
  })
}

//gets all actions from a constituent

const getAllActions = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/actions`, {
      method: "GET",
      headers: headers,
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200)
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
    .catch(error => reject(error))
  })
}

//Creates a constituent and returns the id of the new constituent
const createConstituent = (cObj, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/constituents", {
      method: "POST",
      headers: headers,
      body: cObj
    })
    .then(response => response.json())
    .then(response => {
    if("statusCode" in response) {
      if(response.statusCode !== 200){
        resolve({status: "error", error: response.message})
      }
    } else {
      resolve(response)
    }
  })
  .catch(err => reject(err))
})
}

//Creates a relationship between two constituents
const createRelationship = (reqBody, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/relationships", {
      method: "POST",
      headers: headers,
      body: reqBody
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200){
          resolve({status: "error", error: response.message})
        }
      } else {
        resolve(response)
      }
    })
    .catch(err => reject(err))
  })
}

//Updates a constituent's info
const updateConstituent = (id, reqBodyObj, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}`, {
      method: "PATCH",
      headers: headers,
      body: reqBodyObj,
    })
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200){
          resolve({status: "error", error: response.message})
        }
      } else {
        resolve("Constituent successfully updated")
      }
    })
    .catch(err => reject(err))
  })
}

//Updates a LLB Service
const updateService = (idOfAction, body, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/actions/${idOfAction}`, {
      method: "PATCH",
      headers: headers,
      body: body
    })
    // .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200){
          resolve({status: "error", error: response.message})
        }
      } else {
        resolve("Successfully updated service")
      }
    })
    .catch(err => reject(err))
  })
}

//Creates a LLB Service
const createService = (body,headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/actions", {
      method: "POST",
      headers: headers,
      body: body
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200){
          resolve({status: "error", error: response.message})
        }
      } else {
        resolve(response)
      }
    })
    .catch(err => reject(err))
  })
}

//Gives a constituent a constituetn code
const createConstituentCode = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/constituentcodes", {
      method: "POST",
      headers: headers,
      body: body
    })
    .then(response => response.json())
    .then(response => {
      if("statusCode" in response) {
        if(response.statusCode !== 200){
          resolve({status: "error", error: response.message})
        }
      } else {
        resolve(response)
      }
    })
    .catch(err => reject(err))
  })
}
//Middleware

//Adds SKY Api required headers to header of each request
app.use(async (req, res, next) => {
    req.header = {"Content-Type": "", "Bb-Api-Subscription-Key": SUBSCRIPTION_KEY, "Authorization": `Bearer ${await getValidAccessToken()}`};
    next();
})

//Parses the request body to Json
app.use(express.json())

//Route Handlers

//Returns whether a constituent is a parent, patient, or socialworker based off email
app.get("/constituentFromEmail", async (req, res) => {
  
  let constituentInfo = await getConstituentFromEmail(req.query.email, req.header);
  if(constituentInfo.status === "error") {
    res.send(constituentInfo);
    return;
  }
  
  let constituentCodeList = await getConsituentCodeListFromId(constituentInfo.id, req.header);
  
  let parentIndex = constituentCodeList.value.findIndex((code) => code.description.toLowerCase() === "parent")

  let socialWorkerIndex = constituentCodeList.value.findIndex((code) => code.description.toLowerCase() === "social worker") 


  if(parentIndex !== -1) {
    res.redirect(`/p-portal/${constituentInfo.id}`)
  } else if (socialWorkerIndex !== -1) {
    res.redirect(`/s-portal/${constituentInfo.id}`)
  } else {
    res.send({status: "error", error: "Not a patient, parent, or social worker."})
  }
  
})


//Returns constituent info based off Id, lets the frontend know if they are a parent or socialworker
app.get("/constituent", async (req, res) => {
    res.send(await getConstituentFromId(req.query.id));
})

//Returns an object array, using a parent constituent ID, containing all info about a family: all info of parents and patients based off parent ID. First element is patient, rest are parents
app.get("/constituent/family", async (req, res) => {
  const parentConstituentId = req.query.id;
  const constituentRelationships = await getConstituentRelationships(parentConstituentId, req.header);
  if(constituentRelationships.status && constituentRelationships.status === "error")
  {
    res.send(`Error: ${constituentRelationships.message}`);
  }

  const patientInfoFromRelationship = constituentRelationships.value.find( (relationship) => relationship.reciprocal_type.toLowerCase() === "parent");
  
  const patientId = patientInfoFromRelationship.relation_id;
  
  const patientCompleteInfo = await getConstituentFromId(patientId, req.header);
  
  const patientRelationships = await getConstituentRelationships(patientId, req.header);
  
  if(patientRelationships.status && patientRelationships.status === "error")
  {
    res.send(`Error: ${constituentRelationships.message}`);
  }

  const parentIds = [];

  patientRelationships.value.forEach(relationship => {
    if(relationship.type === "Parent")
    {
      parentIds.push(relationship.relation_id);
    }
  });

  const returnVal = [patientCompleteInfo];

  await Promise.all(parentIds.map(async (id) => getConstituentFromId(id, req.header)))
  .then((values) => {
    values.forEach((value) => returnVal.push(value));
  });

  res.send(returnVal);
})



//Gets all services pertaining to a patient based off their id
app.get("/constituent/services", async (req, res) => {
  const actions = await getAllActions(req.query.id, req.header);
  res.send(actions);

})

//Creates a new family 
app.post("/constituent/family", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  //Create patient
  const patientIdObj = await createConstituent(JSON.stringify(req.body.patient), req.header);
  const patientId = patientIdObj.id;
  //Create parent(s)
  const parentIds = [];

  await Promise.all(req.body.parents.map(async (parent) => createConstituent(JSON.stringify(parent), req.header)))
  .then((values) => {
    values.forEach((value) => parentIds.push(value));
  });

  //Add constituent codes
  await createConstituentCode(JSON.stringify({constituent_id: patientId, description: "Patient"}), req.header);

  await Promise.all(parentIds.map(async (idObj) => createConstituentCode(JSON.stringify({constituent_id: idObj.id, description: "Parent"}), req.header)))

  //Add relationships to eachother, hospital, and socialworker
  const sonOrDaughter = req.body.patient.gender === "Male" ? "Son" : "Daughter";


  await Promise.all(parentIds.map(async (idObj) => createRelationship(JSON.stringify({
      constituent_id: idObj.id,
      reciprocal_type: "Parent",
      relation_id: patientId,
      type: sonOrDaughter
    }), req.header)))

  //Still have to add hospital and social worker relationship need to find out how to; also need to add new constituent codes

  //Adds relationship to hospital
  
  const hospitalInfo = await getConstituentFromName(req.body.hospitalName, req.header);
  const hospitalId = hospitalInfo.id;

  const hospitalError = ("status" in hospitalInfo) && hospitalInfo.status === "error" && hospitalInfo.message === "User not found";

  if(!hospitalError)
  {
    await createRelationship(JSON.stringify({
      constituent_id: hospitalId,
      reciprocal_type: "Hospital",
      relation_id: patientId,
      type: "Patient"
    }), req.header)
  
  }
  
  //Adds relationship to social worker
  
  const socialWorkerInfo = await getConstituentFromEmail(req.body.socialWorkerEmail, req.header)
  const socialWorkerId = socialWorkerInfo.id;
  const socialWorkerError = ("status" in socialWorkerInfo) && socialWorkerInfo.status === "error" && socialWorkerInfo.message === "User not found";

  if(!socialWorkerError)
  {
    await createRelationship(JSON.stringify({
      constituent_id: socialWorkerId,
      reciprocal_type: "Social Worker",
      relation_id: patientId,
      type: "Patient"
    }), req.header)
  }
  

  res.send("Successfully made new family");
})

//Updates a constituent's info based off the constituent Id  
app.patch("/constituent/update", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  var body = JSON.stringify(req.body);
  updateConstituent(req.query.id, body, req.header)
  .then(response => {
    res.send(response);
  })
})

//Updates a LLB Service based off the service's id
app.patch("/service/update", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  var body = JSON.stringify(req.body);
  updateService(req.query.id, body, req.header)
  .then(response => {
    res.send(response);
  })
})

//Creates a LLB Service and sends back the id of the new action
app.post("/service/create", async (req, res) => {
  req.header["Content-Type"] = "application/json";
  const date = new Date();
  date.toISOString();
  req.body["date"] = date;
  const body = JSON.stringify(req.body);
  createService(body, req.header)
  .then(response => res.send(response))
})


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
