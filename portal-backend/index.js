//Set up stuff
require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const app = express();
var cors = require("cors");

const ServicesRoute = require("./routes/services.js");
const ConstituentRoute = require("./routes/constituent.js");

const ConstitutuentModel = require("./models/constituentModel");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const port = process.env.PORT || 5000;
const DB_PASS = process.env.DB_PASS;
const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY;
const uri = `mongodb+srv://wadih:${DB_PASS}@clusterllb.auwn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const AUTHORIZATION = process.env.AUTHORIZATION;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database, collection;

const cookieSession = require('cookie-session');

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

const isLoggedIn = (req, res, next) => {
  console.log(`req.user: ${req.user}`);
  console.log(req.path)

  if (
    req.user !== undefined ||
    (req.path === "/constituent/family" && req.method === "POST") ||
    req.path === "/constituent/constituentFromEmail" ||
    req.path === "/auth/google" ||
    req.path === "/auth/google/callback" ||
    req.path === "/logout"
  ) {
    next();
  } else {
    console.log("hitting redirect");
    res.send({
      redirect: "http://localhost:3000/",
      message: "You must log in to use this service",
    });
  }
};

//Middleware

passport.serializeUser((user, done) => {
  console.log("Serializing user..." + JSON.stringify(user));
  if(user.error !== undefined) {
    console.log("Hitting this")
    user.email = user.error;
    done(null, user.email);
  }
  else {
    console.log("Hitting this")
    done(null, user.email);
  }
});

passport.deserializeUser(async (email, done) => {
  /* console.log("deserializing user...");
  if(email === "User not found"){
    done(null, {email: email})
    console.log("deserializing the following: " + JSON.stringify({email: user.email}))
  }
  else {
    ConstitutuentModel.getConstituentFromEmail(email, {
      "Bb-Api-Subscription-Key": SUBSCRIPTION_KEY,
      Authorization: `Bearer ${await getValidAccessToken()}`,
    })
      .then((user) => {
        console.log("desiralizing the following: " + JSON.stringify(user));
        done(null, user);
      })
      .catch((err) => {
        done(err.toString());
      });
  } */

  done(null, {email: email});
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      ConstitutuentModel.getConstituentFromEmail(profile._json.email, {
        "Bb-Api-Subscription-Key": SUBSCRIPTION_KEY,
        Authorization: `Bearer ${await getValidAccessToken()}`,
      })
        .then((user) => {
          console.log(
            `logged in i have user ${JSON.stringify(user)} moving on to next`
          );
          //Need to figure out what to do if it isn't found
            done(null, user);
        })
        .catch((err) => {
          done(err.toString());
        });
    }
  )
);

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());

app.use(passport.session());

app.use(cors());

app.use(express.json());



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





// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


//Adds the routes
app.all("*", isLoggedIn);

app.use("/services", ServicesRoute);

app.use("/constituent", ConstituentRoute);

//Passport stuff


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    let user = req.user;
    if(user.email === "User not found"){
      res.redirect("http://localhost:3000/new-account");
    }
    else {
      res.redirect(`/constituent/constituentFromEmail?email=${user.email}`);
    }
  }
);

app.get("/logout", (req, res) => {
  console.log("hit log out call");
  req.logout();
  res.redirect(`http://localhost:3000/`);
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
