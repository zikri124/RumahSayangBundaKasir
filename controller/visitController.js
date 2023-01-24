const firebase = require("../firebase");
const fetch = require("node-fetch");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  limit,
  getDoc,
  updateDoc
} = require("firebase/firestore");

const commonFunction = require("../middleware/commonFunctions");
const apiUrl = process.env.apiURL

module.exports = {
  viewVisits: (req, res) => {
    const visitData = req.visitsData;
    const servicesData = req.servicesData;
    const customersData = req.customersData;

    return res.render("admin/viewHistory", {
      visitData: visitData,
      servicesData: servicesData,
      customersData: customersData
    });
  },

  cancelVisit: async (req, res) => {
    const visitId = req.params.visitid;

    const visitData = doc(db, "visits", visitId);

    await updateDoc(visitData, {
      status: "Dibatalkan"
    });

    return res.status(200).redirect("/");
  },

  viewFinishVisit: async (req, res) => {
    const visitData = req.visitData;
    const serviceId = visitData.data.serviceId;
    const customerId = visitData.data.customerId;

    const customerData = await commonFunction.getACustomerData(customerId);

    await fetch(apiUrl + "/api/service/" + serviceId, {
      method: "GET",
      headers: {
        Authorization: "bearer " + req.token
      }
    })
    .then((response) => response.json())
    .then((body) => {
      const serviceData = body.serviceData
      return res.render("admin/viewPrice", {
        visitData: visitData,
        serviceData: serviceData,
        customerId: customerId,
        customerData: customerData
      });
    })
    .catch((err) => {
      return console.log(err);
    });
  },

  finishVisit: async (req, res) => {
    const data = req.body;

    const nCharge = data.nCharge;

    const visitId = req.params.visitId;
    const visitData = req.visitData;
    const visitDoc = doc(db, "visits", visitId);

    let charge = "{";
    let chargeData = "";

    for (let i = 1; i <= nCharge; i++) {
      let name1 = "chargeDesc" + i;
      let name2 = "addCharge" + i;

      chargeData +=
        '"' +
        name1 +
        '":"' +
        data[name1] +
        '","' +
        name2 +
        '":' +
        data[name2] +
        ",";
    }

    charge += chargeData + '"status":"Selesai", "total":' + data.total;

    charge += "}";

    const jsonCharge = JSON.parse(charge);

    await updateDoc(visitDoc, jsonCharge);

    // KIRIM INVOICE-----------------
    let messageText =
      '{ "nCharge": "' +
      nCharge +
      '",' +
      chargeData +
      '"target": "' +
      data.numWa +
      '", "visitId": "' +
      req.params.visitId +
      '", "name": "' +
      data.name +
      '", "age": "' +
      data.customerAge +
      '", "sex": "' +
      data.sex +
      '", "serviceName": "' +
      data.serviceName +
      '", "time": "' +
      data.time +
      '", "price": "' +
      data.charge +
      '", "total": "' +
      data.total +
      '"';

    messageText += "}";

    const messageData = JSON.parse(messageText);
    console.log(messageData);

    // fetch("http://localhost/" + "/send-invoice", {
    //   method: "POST",
    //   body: JSON.stringify(messageData),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then((response) => response.text())
    //   .then((body) => {
    //     console.log(body);
    //     return res.status(200).redirect("/");
    //   })
    //   .catch((err) => {
    //     return console.log(err);
    //   });

    return res.status(200).redirect("/");
  }
};
