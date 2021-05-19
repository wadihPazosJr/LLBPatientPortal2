require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

const DB_PASS = process.env.DB_PASS;

const uri = `mongodb+srv://wadih:${DB_PASS}@clusterllb.auwn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CLIENT_ID = process.env.CLIENT_ID;
const AUTHORIZATION = process.env.AUTHORIZATION;

app.get("/", (req, res) => {
  res.redirect(
    `https://oauth2.sky.blackbaud.com/authorization?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:4000/oauth2/callback`
  );
});

app.get("/oauth2/callback", async (req, res) => {
  let callbackCode = req.query.code;
  if (req.query.error) {
    res.send(`ERROR:  ${req.query.error}`);
  } else {
    console.log(req.query, callbackCode);

    getToken(callbackCode)
      .then((refreshToken) => {
        res.send(`SUCCESS:  ${refreshToken}`);
      })
      .catch((err) => {
        res.send(`ERROR:  ${err.toString()}`);
      });
  }
});

const getToken = (callbackCode) => {
  return new Promise((resolve, reject) => {
    let body = {
      grant_type: "authorization_code",
      code: callbackCode,
      redirect_uri: "http://localhost:4000/oauth2/callback",
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
    console.log(formBody);
    fetch("https://oauth2.sky.blackbaud.com/token", {
      method: "POST",
      body: formBody,
      headers: headers,
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
        let refreshToken = res.refresh_token;
        let accessToken = res.access_token;
        let refreshExpiresIn = res.refresh_token_expires_in;
        let accessExpiresIn = res.expires_in;
        await updateToken(refreshToken, accessToken, refreshExpiresIn, accessExpiresIn)
          .then(() => {
            resolve(refreshToken);
            resolve(expires_in);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const updateToken = (refresh, access, refreshExpire, accessExpire) => {
  return new Promise((resolve, reject) => {
    let database = client.db("llb");
    let collection = database.collection("admin");
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
