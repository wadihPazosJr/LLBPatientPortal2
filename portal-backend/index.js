require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

const DB_PASS = process.env.DB_PASS;
const SUBSSCRIPTION_KEY = processs.env.SUBSSCRIPTION_KEY;

const uri = `mongodb+srv://wadih:${DB_PASS}@clusterllb.auwn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database = client.db("llb");
let collection = database.collection("admin");

const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;

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
    let refreshToken;
    collection.findOne({}, function(err, result) {
        if(err) console.log(err);
        refreshToken = result.refresh_token;
    });

    return refreshToken;
}

function refreshAccessToken(){
    let newAccessToken;
    let body = {
        grant_type: "refresh_token",
        refresh_token: getValidRefreshToken()
      };
      let headers = {
        Authorization: `Basic ${AUTHORIZATION}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      var formBody = [];
      for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

    fetch("https://oauth2.sky.blackbaud.com/token", {
        method: "POST",
        body: formBody,
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
            resolve(refreshToken);
            resolve(refreshExpiresIn);
            resolve(accessExpiresIn);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });

      return newAccessToken;
}


function getValidAccessToken(){
    let database = client.db("llb");
    let collection = database.collection("admin");
    let accessToken;
    let accessExpiresOn;
    collection.findOne({}, function(err, result) {
        if(err) console.log(err);
        accessToken = result.access_token;
        accessExpiresOn = result.access_expires_on;
    });

    let fiveMinBeforeExpire = accessExpiresOn - 300000;

    if(Date.now() >= fiveMinBeforeExpire)
    {
        refreshAccessToken();
    }
    else
    {
        return accessToken;
    }
}

app.use((req, res, next) => {
    req.header = {"Content-Type": "application/x-www-form-urlencoded", "Bb-ApiSubscription-Key": SUBSSCRIPTION_KEY, "Authorization": getValidAccessToken()};
    next();
})


const start = async () => {
  try {
    client.on("connect", () => {
      console.log("CONNECTED TO MONGODB!");
    });
    await client.connect();
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    await client.close();
    console.log("APPLICATION ERROR! ", error.toString());
  }
};

start();
