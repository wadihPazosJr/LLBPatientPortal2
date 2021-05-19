require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

const DB_PASS = process.env.DB_PASS;
const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;

const uri = `mongodb+srv://wadih:${DB_PASS}@clusterllb.auwn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database, collection;

const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;

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

function getValidRefreshToken(){
  return new Promise(async (resolve, reject) => {
    let oauthInfo = await collection.findOne({purpose: "oauth"}).catch((err) => {
      console.log(err);
      return reject(err);
    })
    resolve(oauthInfo.refresh_token)
  })
    
}

function refreshAccessToken(){
  return new Promise(async (resolve, reject) => {
    let newAccessToken;
    let body = {
        grant_type: "refresh_token",
        refresh_token: await getValidRefreshToken().catch((err) => {
          console.log(err);
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
        console.log(res);
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


function getValidAccessToken(){
  return new Promise(async (resolve, reject) => {
    let accessToken;
    let accessExpiresOn;
    const result = await collection.findOne({purpose: "oauth"}).catch((err) => {
      console.log(err);
      return reject(err);
    });

    
    accessToken = result.access_token;
    accessExpiresOn = result.access_expires_on;

    let fiveMinBeforeExpire = accessExpiresOn - 300000;


    if(Date.now() >= fiveMinBeforeExpire)
    {
        console.log("5 MIN BEFORE EXPIRE")
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
  })
}

app.use(async (req, res, next) => {
    req.header = {"Content-Type": "application/x-www-form-urlencoded", "Bb-Api-Subscription-Key": SUBSCRIPTION_KEY, "Authorization": `Bearer ${await getValidAccessToken()}`};
    next();
})

//Returns whether a constituent is a parent, patient, or socialworker based off email
app.get("/constituentFromEmail", async (req, res) => {
  
  let constituentInfo = await getConstituentFromEmail(req.query.email, req.header);
  console.log(constituentInfo)
  if(constituentInfo.status === "error") {
    res.send(constituentInfo);
    return;
  }
  
  let constituentCodeList = await getConsituentCodeListFromId(constituentInfo.id, req.header);
  console.log(constituentCodeList)
  let parentIndex = constituentCodeList.value.findIndex((code) => code.description.toLowerCase() === "parent")
  let patientIndex = constituentCodeList.value.findIndex((code) => code.description.toLowerCase() === "patient")

  let socialWorkerIndex = constituentCodeList.value.findIndex((code) => code.description.toLowerCase() === "social worker") 


  if(parentIndex !== -1) {
    res.redirect(`/p-portal/${constituentInfo.id}?isParent=true`)
  } else if (patientIndex !== -1) {
    res.redirect(`/s-portal/${constituentInfo.id}?isParent=false`)
  } else if (socialWorkerIndex !== -1) {
    res.redirect(`/s-portal/${constituentInfo.id}`)
  } else {
    res.send({status: "error", error: "Not a patient, parent, or social worker."})
  }

})

const getConstituentFromEmail = (email, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/search?search_text=${email}`, {
      method: "GET",
      headers: headers
    })
    .then((response) => response.json())
    .then((response) => {
      // console.log(response)
      if(response.statusCode && response.statusCode !== 200) {
        resolve({status: "error", error: response.message})
      } else {
        if(response.count <= 0) {
          resolve({status: "error", error: "User not found."})
        } else {
          let constituentInfo = response.value.find(obj => {
            return obj.email === email;
          })
          resolve(constituentInfo);
        }
      }
    })
  })
}

const getConstituentFromId = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/`, {
      method: "GET",
      headers: req.header
    })
    .then(response => response.json())
    .then(response => {
      if(response.statusCode !== 200) {
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
  })
  
}

const getConsituentCodeListFromId = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.sky.blackbaud.com/constituent/v1/constituents/${id}/constituentcodes`, {
      method: "GET",
      headers: headers
    })
    .then(response => response.json())
    .then(response => {
      if(response.statusCode && response.statusCode !== 200) {
        resolve({status: "error", error: response.message})
      } else {
        resolve(response)
      }
    })
  })
}

//Returns constituent info based off Id
app.get("/constituent", async (req, res) => {
    res.send(await getConstituentFromId(req.query.id));
})


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
