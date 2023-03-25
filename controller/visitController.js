const firebase = require("../firebase");
const fetch = require("node-fetch");
const db = firebase.firestore;
const {
  doc,
  updateDoc,
  Timestamp
} = require("firebase/firestore");

const commonFunction = require("../middleware/commonFunctions");
const apiUrl = process.env.apiURL;

module.exports = {
  viewVisits: (req, res) => {
    const visitData = req.visitsData;
    const servicesData = req.servicesData;
    const customersData = req.customersData;

    return res.render("admin/viewHistory", {
      visitData: visitData,
      servicesData: servicesData,
      customersData: customersData,
    });
  },

  cancelVisit: async (req, res) => {
    const visitId = req.params.visitid;

    const visitData = doc(db, "visits", visitId);

    await updateDoc(visitData, {
      status: "Dibatalkan",
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
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        const serviceData = body.serviceData;
        return res.render("admin/viewPrice", {
          visitData: visitData,
          serviceData: serviceData,
          customerId: customerId,
          customerData: customerData,
        });
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  createVisitForm1: async (req, res) => {
    const date = req.query.date
    const serviceId = req.query.serviceId
    const serviceCare = req.query.serviceCare
    
    res.render("admin/viewAdminNewVisit", {
      date: date,
      serviceId: serviceId,
      serviceCare: serviceCare
    })
  },

  createVisitFromExistCustomer: async (req, res, next) => {
    const appointmentData = {
      customerType: "exist"
    }

    const data = {
      serviceId: req.body.serviceId,
      date: req.body.date,
      serviceCare: req.body.serviceCare,
      address: req.body.address
    }

    appointmentData["data"] = data

    req.appointmentData = appointmentData
    next()

  },

  createVisitFromNewCustomer: async (req, res, next) => {
    const appointmentData = {
      type: "new customer"
    }

    const data = {
      serviceId: req.body.serviceId,
      date: req.body.date,
      serviceCare: req.body.serviceCare,
      address: req.body.address
    }

    appointmentData["data"] = data

    req.appointmentData = appointmentData
    next()
  },

  finishVisit: async (req, res) => {
    const data = req.body;

    const nCharge = data.nCharge;
    const timestamp = Timestamp.now()
    const dateClass = timestamp.toDate();
    let hours = dateClass.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = dateClass.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    const time = hours + "." + minutes;

    const visitId = req.params.visitId;
    const visitDoc = doc(db, "visits", visitId);

    let charge = "{";
    let chargeData = "";
    let messageTextCharge = "";

    for (let i = 1; i <= nCharge; i++) {
      let name1 = "chargeDesc" + i;
      let name2 = "addCharge" + i;

      if (data[name1] != "" || data[name1] != "") {
        chargeData += '"' + name1 + '":"' + data[name1] + '","' + name2 + '":' + data[name2] + ",";

        messageTextCharge += `\n${data[name1]}: ${data[name2]}`;
      }
    }

    charge += chargeData + '"status":"Selesai", "total":' + data.total;

    charge += "}";

    const jsonCharge = JSON.parse(charge);

    jsonCharge["timeFinish"] = time;
    jsonCharge["updatedAt"] = timestamp;

    await updateDoc(visitDoc, jsonCharge);

    // INVOICE-----------------
    let messageText = `ID Kunjungan: ${visitId}`;
    messageText += `\nWaktu: ${data.date}, ${data.time}`;
    messageText += `\nNama: ${data.name}`;
    messageText += `\nUmur: ${data.customerAge}`;
    messageText += `\nJenis Kelamin: ${data.sex}`;
    messageText += `\nLayanan: ${data.serviceName}`;
    messageText += `\nJenis Layanan: ${data.serviceCare}`;
    if (data.serviceCare != "Klinik") {
      messageText += `Alamat: ${data.address}`
    }
    messageText += `\n\n*Biaya*`;
    messageText += `\nLayanan: Rp ${data.charge}`;
    messageText += messageTextCharge;
    messageText += `\n*Total: ${data.total}*`;
    messageText += `\n\nTerima Kasih atas kepercayaan kepada kami`;
    messageText += `\nSemoga puas dengan pelayanan kami`;
    messageText += `\n\nSalam Cinta, Rumah Sayang Bunda`;

    const uri = "https://wa.me/" + data.numWa + "?text=*INVOICE KUNJUNGAN RUMAH SAYANG BUNDA*\n\n" + messageText;

    const uriEncoded = encodeURI(uri);

    return res.render("admin/viewPriceSubmit", {
      uri: uriEncoded
    })
  }
};
