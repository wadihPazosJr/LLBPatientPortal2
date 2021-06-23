const fetch = require("node-fetch");
const url = require("url").URL;
//Delete an action based off its id

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

//Gets all actions of a constituent based off the constituent id

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

//Gets all the custom fields of an action based off the action id

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

//Updates a service, takes the id of the action and the request body of the updated action as parameters
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

//Updates an action's custom field, based off the custom field's id

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

//Creates a service, takes the body of the new service as a parameter

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

//Adds a custom field to an action, takes the body of the custom field as a parameter
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

//Creates a new document with Blackbaud

const createDocument = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/documents", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        if ("statusCode" in res) {
          if (res.statusCode !== 200) {
            resolve({ status: "error", error: res.message });
          }
        } else {
          resolve(res);
        }
      })
      .catch((err) => reject(err));
  });
};

const createAttachment = (body, headers) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.sky.blackbaud.com/constituent/v1/actions/attachments", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

const getAttachmentsAction = (actionId, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/actions/${actionId}/attachments`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if ("statusCode" in res) {
          if (res.statusCode !== 200) {
            resolve({ status: "error", error: res.message });
          }
        } else {
          resolve(res);
        }
      })
      .catch((err) => reject(err));
  });
};

const deleteActionAttachment = (id, headers) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.sky.blackbaud.com/constituent/v1/actions/attachments/${id}`,
      {
        method: "DELETE",
        headers: headers,
      }
    )
      .then(() => resolve("Success"))
      .catch((err) => reject(err));
  });
};

module.exports = {
  deleteAction,
  getAllActions,
  getCustomFieldsAction,
  updateService,
  addActionCustomField,
  createService,
  updateActionCustomField,
  createDocument,
  createAttachment,
  getAttachmentsAction,
  deleteActionAttachment,
};
