const firebase = require("../firebase");
const fetch = require("node-fetch");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  QuerySnapshot
} = require("firebase/firestore");

const apiUrl = process.env.apiURL

module.exports = {
  viewServices: (req, res) => {
    const servicesData = req.servicesData;

    return res.render("admin/viewServices", {
      servicesData: servicesData
    });
  },

  addService: async (req, res) => {
    const serviceData = {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    };

    await fetch(apiUrl + "/api/service/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        },
        body: JSON.stringify(serviceData)
      })
      .then((response) => response.json())
      .then((body) => {
        if (body.success == true) {
          return res.status(200).redirect("/service");
        } else {
          return console.log(body.error)
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  updateService: async (req, res) => {
    const serviceId = req.params.serviceId;

    const serviceData = {
      name: req.body.name,
      price: req.body.price,
      room: req.body.room,
      description: req.body.description
    }

    await fetch(apiUrl + "/api/service/edit/" + serviceId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        },
        body: JSON.stringify(serviceData)
      })
      .then((response) => response.json())
      .then((body) => {
        if (body.success == true) {
          return res.status(200).redirect("/service");
        } else {
          return console.log(body.error)
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  deleteService: async (req, res) => {
    const serviceId = req.params.serviceId;

    await fetch(apiUrl + "/api/service/delete/" + serviceId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        }
      })
      .then((response) => response.json())
      .then((body) => {
        if (body.success == true) {
          return res.status(200).redirect("/service");
        } else {
          return console.log(body.error)
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  }
};