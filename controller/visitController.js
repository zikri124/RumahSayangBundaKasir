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
    let messageTextCharge = "";

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

      messageTextCharge += `\n${data[name1]}: ${data[name2]}`
    }

    charge += chargeData + '"status":"Selesai", "total":' + data.total;

    charge += "}";

    const jsonCharge = JSON.parse(charge);

    await updateDoc(visitDoc, jsonCharge);

    // // KIRIM INVOICE-----------------

    let messageText = `ID Kunjungan: ${visitId}`
    messageText += `\nWaktu: ${data.date}, ${data.time}`
    messageText += `\nNama: ${data.name}`
    messageText += `\nUmur: ${data.customerAge}`
    messageText += `\nJenis Kelamin: ${data.sex}`
    messageText += `\nLayanan: ${data.serviceName}`
    messageText += `\n\n*Biaya*`
    messageText += `\nLayanan: Rp ${data.charge}`
    messageText += messageTextCharge
    messageText += `\n*Total: ${data.total}*`
    messageText += `\n\nTerima Kasih atas kepercayaan kepada kami`
    messageText += `\nSemoga puas dengan pelayanan kami`
    messageText += `\n\nSalam Cinta, Rumah Sayang Bunda`

    const uri = "https://wa.me/" + data.numWa + "?text=*INVOICE KUNJUNGAN RUMAH SAYANG BUNDA*\n\n" + messageText

    const uriEncoded = encodeURI(uri)

    const payload = {
      uri: uriEncoded
    }

    const token = await jwt.sign(payload, process.env.JWT_KEY);

    return res.status(200).redirect("/visit/finish/done/" + token);
  },

  viewDoneVisit: async (req, res) => {
    const token = req.params.token

    const payload = await jwt.verify(token, process.env.JWT_KEY);
    if (payload) {
      const uri = payload.uri
      return res.render("admin/viewPriceSubmit", {
        uri: uri
      })
    } else {
      console.log(payload)
      return res.status(500).redirect("/");
    }
  }
};