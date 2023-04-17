const fetch = require("node-fetch");

const apiUrl = process.env.apiURL

const commonFunctions = require("../middleware/commonFunctions")

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

    let checkEmpty = commonFunctions.checkEmpty(serviceData)

    if (checkEmpty.contains) {
      return res.render("admin/errorView", {
        tittle: "Oppps!! Data yang kamu masukkan belum lengkap nih",
        message: "Form pada bagian \"" + checkEmpty.value + "\" belum kamu isi nih"
      })
    }

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

    let checkEmpty = commonFunctions.checkEmpty(serviceData)

    if (checkEmpty.contains) {
      return res.render("admin/errorView", {
        tittle: "Oppps!! Data yang kamu masukkan belum lengkap nih",
        message: "Form pada bagian \"" + checkEmpty.value + "\" belum kamu isi nih"
      })
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