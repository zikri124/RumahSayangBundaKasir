const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  addDoc
} = require("firebase/firestore");
const axios = require("axios").default;

const commonFunc = require("../middleware/commonFunctions");

const apiUrl = process.env.apiURL;

module.exports = {
  viewAppointments: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;

    return res.render("admin/viewNextReservasi", {
      appointmentsData: appointmentsData,
      servicesData: servicesData,
    });
  },

  viewAppointmentsByTime: async (req, res) => {
    const servicesData = req.servicesData;
    const appointmentsData = req.appointmentsData;

    return res.render("admin/viewNextReservasi", {
      appointmentsData: appointmentsData,
      servicesData: servicesData,
    });
  },

  viewEditAppointment: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;
    const address = req.query.address;
    const serviceCare = req.query.serviceCare;
    var appointmentData;

    appointmentsData.forEach((appointment) => {
      if (appointment.id == req.params.appId) {
        appointmentData = appointment;
      }
    });

    if (req.sessionsData == null) {
      return res.render("admin/viewEditReservasi", {
        appointmentData: appointmentData,
        servicesData: servicesData,
      });
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;
      const serviceData = req.serviceData;

      const sessionsData = req.sessionsData;

      return res.render("admin/viewEditReservasi", {
        sessionsData: sessionsData,
        servicesData: servicesData,
        serviceData: serviceData,
        appointmentData: appointmentData,
        date: date,
        serviceId: serviceId,
        address: address,
        serviceCare: serviceCare,
      });
    }
  },

  editAppointment: async (req, res) => {
    const appointmentId = req.params.appId;

    const data = {
      serviceId: req.body.serviceId,
      time: req.body.time,
      date: req.body.date,
      serviceCare: req.body.serviceCare,
      address: req.body.address,
    };
    console.log(data);

    try {
      const result = await axios.put(apiUrl + "/api/appointment/update/" + appointmentId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      });

      console.log(result.data);
      return res.redirect("/appointment");
    } catch (err) {
      return console.log(err);
    }
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
      address: appointmentData.data.address,
    };

    await addDoc(collection(db, "visits"), visitData)
      .then(() => {
        next();
      })
      .catch((err) => {
        console.log(err);
        next(err)
      });
  },

  updateAppointmentStatusTrue: async (req, res, next) => {
    const appointmentId = req.params.appId;
    const data = JSON.stringify({
      status: true,
    });

    await axios.put(apiUrl + "/api/appointment/update/" + appointmentId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.render("admin/successProcessApp")
      })
      .catch((err) => {
        console.log(err);
      })
  },

  cancelAppointmentAsAdmin: async (req, res) => {
    const appointmentId = req.params.appId;
    const data = JSON.stringify({
      status: "cancelled",
    });

    try {
      const result = await axios.put(apiUrl + "/api/appointment/update/" + appointmentId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      });

      console.log(result.data);
      return res.redirect("/");
    } catch (err) {
      return console.log(err);
    }
  },
};
