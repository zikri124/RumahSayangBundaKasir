const firebase = require("../firebase");

const jwt = require("jsonwebtoken");
const { google } = require("googleapis"); //s
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc
} = require("firebase/firestore");

const commonFunc = require("../middleware/commonFunctions");

module.exports = {
  viewAppointments: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;

    return res.render("admin/viewNextReservasi", {
      appointmentsData: appointmentsData,
      servicesData: servicesData
    });
  },

  viewAppointmentsByTime: async (req, res) => {
    const servicesData = req.servicesData;
    const appointmentsData = req.appointmentsData;

    return res.render("admin/viewNextReservasi", {
      appointmentsData: appointmentsData,
      servicesData: servicesData
    });
  },

  viewProcessAppointment: async (req, res) => {
    const appointmentData = req.appointmentData;

    const customersData = req.customersData;

    const serviceData = req.servicesData;

    const customerQuery2 = query(collection(db, "services"));

    await getDocs(customerQuery2)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          serviceData.push(doc.data());
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return res.render("admin/formProcessReservasi", {
      appointmentData: appointmentData,
      customersdata: customersData,
      serviceData: serviceData
    });
  },

  viewEditAppointment: async (req, res) => {
    const appointmentData = req.appointmentData;
    const servicesData = req.servicesData;
    if (req.sessionsData == null) {
      return res.render("admin/viewEditReservasi", {
        appointmentData: appointmentData,
        servicesData: servicesData
      });
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;
      const serviceData = await commonFunc.getAServiceData(serviceId);

      const sessionsData = req.sessionsData;

      return res.render("admin/viewEditReservasi", {
        sessionsData: sessionsData,
        servicesData: servicesData,
        serviceData: serviceData,
        appointmentData: appointmentData,
        date: date,
        serviceId: serviceId
      });
    }
  },

  editAppointment: async (req, res) => {
    const appointmentId = req.params.appId;
    const serviceId = req.body.serviceId;
    const time = req.body.time;
    const date = req.body.date;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      time: time,
      date: date,
      serviceId: serviceId
    })
      .then(() => {
        return res.status(200).redirect("/appointment");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  processAppointmentToVisit: async (req, res) => {
    const appId = req.params.appId;
    const dateClass = new Date();
    const appointmentData = req.appointmentData;

    const appointmentDoc = doc(db, "appointments", appId);

    await updateDoc(appointmentDoc, {
      status: true
    });

    const customerId = req.body.customerId;

    const customerData = await commonFunc.getACustomerData(customerId);
    const customerAge = commonFunc.getAge(customerData.dateOfBirth);

    let hours = dateClass.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = dateClass.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    const time = hours + "." + minutes;

    const visitData = {
      customerId: customerId,
      customerAge: customerAge,
      serviceId: appointmentData.data().serviceId,
      date: appointmentData.data().date,
      time: time,
      timeFinish: "",
      status: "Sedang Jalan",
      staffId: req.user.uid,
      numWa: appointmentData.data().numWa
    };

    await addDoc(collection(db, "visits"), visitData)
      .then(async () => {
        return res.status(200).redirect("/");
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  cancelAppointmentAsAdmin: async (req, res) => {
    const appointmentId = req.params.appId;

    const appointmentData = doc(db, "appointments", appointmentId);

    await updateDoc(appointmentData, {
      status: "cancelled"
    })
      .then(() => {
        return res.status(200).redirect("/");
      })
      .catch((error) => {
        return console.log(error);
      });
  }
};
