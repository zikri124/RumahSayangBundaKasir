const firebase = require("../firebase");
const fetch = require("node-fetch");
const db = firebase.firestore;
const {
  collection,
  addDoc
} = require("firebase/firestore");

const commonFunc = require("../middleware/commonFunctions");
const commonFunctions = require("../middleware/commonFunctions");

const apiUrl = process.env.apiURL

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

  viewEditAppointment: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;
    var appointmentData

    appointmentsData.forEach(appointment => {
      if (appointment.id == req.params.appId) {
        appointmentData = appointment
      }
    });

    if (req.sessionsData == null) {
      return res.render("admin/viewEditReservasi", {
        appointmentData: appointmentData,
        servicesData: servicesData
      });
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;
      const serviceData = req.serviceData

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

    const data = {
      serviceId: req.body.serviceId,
      time: req.body.time,
      date: req.body.date
    }

    await fetch(apiUrl + "/api/appointment/update/" + appointmentId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        },
        body: JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((body) => {
        if (body.success == true) {
          return res.status(200).redirect("/appointment");
        } else {
          return console.log(body.error)
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  processAppointmentToVisit: async (req, res, next) => {
    const dateClass = new Date();
    const appointmentData = req.appointmentData;
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
      serviceId: appointmentData.data.serviceId,
      date: appointmentData.data.date,
      time: time,
      timeFinish: "",
      status: "Sedang Jalan",
      staffId: req.user.uid,
      numWa: appointmentData.data.numWa,
      serviceCare: appointmentData.data.serviceCare,
      address: appointmentData.data.address
    };

    await addDoc(collection(db, "visits"), visitData)
      .then(async () => {
        next()
      })
      .catch((error) => {
        const err = new Error(error)
        console.log(error)
        return err
      });
  },

  updateAppointmentStatusTrue: async (req, res) => {
    const appointmentId = req.params.appId;
    const body = JSON.stringify({
      status: true
    })

    await fetch(apiUrl + "/api/appointment/update/" + appointmentId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        },
        body: body
      })
      .then((response) => response.json())
      .then((body) => {
        console.log(body)
        if (body.success == true) {
          return res.redirect("/");
        } else {
          console.log(body.error)
          return false
        }
      })
      .catch((err) => {
        console.log(err);
        return err
      });
  },

  cancelAppointmentAsAdmin: async (req, res) => {
    const appointmentId = req.params.appId;

    await fetch(apiUrl + "/api/appointment/update/" + appointmentId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "bearer " + req.token
        },
        body: JSON.stringify({
          status: "cancelled"
        })
      })
      .then((response) => response.json())
      .then((body) => {
        if (body.success == true) {
          return res.status(200).redirect("/");
        } else {
          return console.log(body.error)
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  }
};