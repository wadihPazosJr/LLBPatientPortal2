const fetch = require("node-fetch");
const url = require("url").URL;

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
        .catch((erlr) => reject(err));
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

  //Calls the sky api endpoint to get the constituent matching the email address. Returns basic constituent info
const getConstituentFromEmail = (email, headers) => {
  console.log(email);  
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
            console.log("count is less then zero");
            resolve({ status: "error", error: "User not found" });
          } else {
            const rightConstituent = response.value.find(
              (constituent) => {
                console.log(`Checking constituent: ${JSON.stringify(constituent)}`);
                return constituent.email.toLowerCase() === email.toLowerCase()
              }
            );
  
            if (rightConstituent !== undefined) {
              resolve(rightConstituent);
            } else {
              resolve({ status: "error", error: "User not found" });
            }
          }
        })
        .catch((error) => reject(error));
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

module.exports = {
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
    getConsituentCodeListFromId
}