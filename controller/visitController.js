const firebase = require("../firebase");
const fetch = require("node-fetch");
const db = firebase.firestore;
const {
  doc,
  updateDoc,
  Timestamp,
  collection,
  getDoc,
  getDocs,
  query,
  where
} = require("firebase/firestore");

const commonFunctions = require("../middleware/commonFunctions");
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
    const visitId = req.params.visitId;
    const timestamp = Timestamp.now();

    const visitData = doc(db, "visits", visitId);

    await updateDoc(visitData, {
      status: "Dibatalkan",
      canceledAt: timestamp
    });

    return res.status(200).redirect("/");
  },

  viewFinishVisit: async (req, res) => {
    const visitData = req.visitData;
    const serviceId = visitData.data.serviceId;
    const customerId = visitData.data.customerId;

    const customerData = await commonFunctions.getACustomerData(customerId);

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
    const customersData = req.customersData
    const sessionsData = req.sessionsData
    const sessions = req.sessions
    const servicesData = req.servicesData

    const visitQuery = query(collection(db, "visits"), where("date", "==", date), where("serviceId", "==", serviceId), where("status", "==", "Sedang Jalan"));
    await getDocs(visitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const visit = {
            id: doc.id,
            data: doc.data(),
          };
          sessionsData.push(visit);
        });
        console.log(sessionsData)
      })
      .catch((err) => {
        return console.log(err);
      });

    res.render("admin/viewAdminNewVisit", {
      date: date,
      serviceId: serviceId,
      serviceCare: serviceCare,
      customersData: customersData,
      sessionsData: sessionsData,
      sessions: sessions,
      servicesData: servicesData
    })
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

    charge += chargeData + '"status":"Selesai", "total":' + data.total;

    charge += "}";

    const jsonCharge = JSON.parse(charge);

    const charge1 = []

    for (let i = 1; i <= nCharge; i++) {
      let name1 = "chargeDesc" + i;
      let name2 = "addCharge" + i;

      if (data[name1] === undefined) {

      } else {
        if (data[name1] != "" || data[name1] != null) {
          const charge2 = {
            chargeDesc: data[name1],
            addCharge: data[name2]
          }

          messageTextCharge += `\n${data[name1]}: Rp ${data[name2]}`;

          charge1.push(charge2)
        }
      }

    }

    jsonCharge["charge"] = charge1;
    jsonCharge["timeFinish"] = time;
    jsonCharge["updatedAt"] = timestamp;
    jsonCharge["serviceCharge"] = data.charge;

    await updateDoc(visitDoc, jsonCharge);

    const visitData = req.visitData

    // INVOICE-----------------
    let messageText = `ID Kunjungan: ${visitId}`;
    messageText += `\nWaktu: ${data.date}, ${data.time}`;
    messageText += `\nNama: ${data.name}`;
    messageText += `\nUmur: ${data.customerAge}`;
    messageText += `\nJenis Kelamin: ${data.sex}`;
    messageText += `\nLayanan: ${data.serviceName}`;
    messageText += `\nJenis Layanan: ${visitData.data.serviceCare}`;
    if (visitData.data.serviceCare == "homecare") {
      messageText += `Alamat: ${visitData.data.address}`
    }
    messageText += `\n\n*Biaya*`;
    messageText += `\nLayanan: Rp ${data.charge}`;
    messageText += messageTextCharge;
    messageText += `\n*Total: Rp ${data.total}*`;
    messageText += `\n\nTerima Kasih atas kepercayaan kepada kami`;
    messageText += `\nSemoga puas dengan pelayanan kami`;
    messageText += `\n\nSalam Cinta, Rumah Sayang Bunda`;

    const numWa = commonFunctions.checkFormatNumWa(data.numWa)

    const uri = "https://wa.me/" + numWa + "?text=*INVOICE KUNJUNGAN RUMAH SAYANG BUNDA*\n\n" + messageText;

    const uriEncoded = encodeURI(uri);

    return res.render("admin/viewPriceSubmit", {
      uri: uriEncoded
    })
  }
};