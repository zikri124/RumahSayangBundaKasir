const firebase = require("../firebase");
const db = firebase.firestore;
const { collection, addDoc, query, where, getDocs, Timestamp } = require("firebase/firestore");
const axios = require("axios").default;

const commonFunctions = require("../middleware/commonFunctions");

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

  viewAddAppointment: async (req, res) => {
    const date = req.query.date;
    const serviceId = req.query.serviceId;
    const serviceCare = req.query.serviceCare;

    const sessions = req.sessions;
    var sessionsData = req.sessionsData;
    const servicesData = req.servicesData;
    const onGoingVisits = req.onGoingVisits;

    sessionsData = sessionsData.concat(onGoingVisits);

    // return res.json({
    //   sessionsData: sessionsData,
    //   date: date,
    //   serviceId: serviceId,
    //   servicesData: servicesData,
    //   serviceCare: serviceCare,
    //   sessions: sessions
    // })

    return res.render("admin/viewFormNewAppointment", {
      sessionsData: sessionsData,
      date: date,
      serviceId: serviceId,
      servicesData: servicesData,
      serviceCare: serviceCare,
      sessions: sessions,
    });
  },

  addAppointment: async (req, res) => {
    const appointmentData = {
      name: req.body.input_name,
      time: req.body.input_time,
      dateOfBirth: req.body.input_dob,
      date: req.body.input_date,
      serviceId: req.body.input_serviceId,
      numWa: req.body.no_hp,
      igAccount: req.body.igAcc,
      serviceCare: req.body.serviceCare,
      address: req.body.input_address,
      createdAt: Timestamp.now(),
      serviceName: req.body.serviceName,
      keluhan: req.body.keluhan,
    };

    try {
      const result = await axios.post(apiUrl + "/api/appointment/new", appointmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      });

      if (result.success) {
        console.log(result.data);
        return res.redirect("/");
      } else {
        return res.render("admin/errorView", {
          tittle: "Ada Masalah Saat Menambahkan Reservasi Baru",
          message: result.message,
        });
      }
    } catch (err) {
      return console.log(err);
    }
  },

  viewEditAppointment: async (req, res) => {
    const appointmentsData = req.appointmentsData;
    const servicesData = req.servicesData;
    const address = req.query.address;
    const serviceCare = req.query.serviceCare;
    var appointmentData;
    const sessions = req.sessions;

    appointmentsData.forEach((appointment) => {
      if (appointment.id == req.params.appId) {
        appointmentData = appointment;
      }
    });

    if (appointmentData.data.status != false) {
      return res.render("admin/errorView", {
        tittle: "Tidak Bisa Mengubah Reservasi",
        message: "Reservasi yang telah di proses atau dibatalkan tidak bisa di ubah",
      });
    }

    if (req.sessionsData == null || req.query.serviceId == undefined || req.query.date == undefined) {
      return res.render("admin/viewEditReservasi", {
        appointmentData: appointmentData,
        servicesData: servicesData,
        sessions: sessions,
      });
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;
      const serviceData = req.serviceData;
      const onGoingVisits = [];

      const visitQuery = query(collection(db, "visits"), where("date", "==", date), where("serviceId", "==", serviceId), where("status", "==", "Sedang Jalan"));
      await getDocs(visitQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const visit = {
              id: doc.id,
              data: doc.data(),
            };
            onGoingVisits.push(visit);
          });
        })
        .catch((err) => {
          return console.log(err);
        });

      const sessionsData = req.sessionsData;
      const sessionsNVisitsData = sessionsData.concat(onGoingVisits);
      console.log(sessionsNVisitsData);

      return res.render("admin/viewEditReservasi", {
        sessionsData: sessionsData,
        servicesData: servicesData,
        serviceData: serviceData,
        appointmentData: appointmentData,
        date: date,
        serviceId: serviceId,
        address: address,
        serviceCare: serviceCare,
        sessions: sessions,
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
      serviceName: req.body.serviceName,
    };

    let checkEmpty = commonFunctions.checkEmpty(data);

    if (checkEmpty.contains) {
      return res.render("admin/errorView", {
        tittle: "Oppps!! Data yang kamu masukkan belum lengkap nih",
        message: 'Form pada bagian "' + checkEmpty.value + '" belum kamu isi nih',
      });
    }

    try {
      const result = await axios.put(apiUrl + "/api/appointment/update/" + appointmentId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      });

      if (result.success) {
        console.log(result.data);
        return res.redirect("/appointment");
      } else {
        return res.render("admin/errorView", {
          tittle: "Tidak Bisa Mengubah Reservasi",
          message: result.message,
        });
      }
    } catch (err) {
      return console.log(err);
    }
  },

  createVisit: async (req, res, next) => {
    const timestamp = Timestamp.now();
    let customerId;

    if (req.customerType == "new") {
      customerId = req.customerId;
    } else {
      customerId = req.body.customerId;
    }
    const customerData = await commonFunctions.getACustomerData(customerId);
    const customerAge = commonFunctions.getAge(customerData.dateOfBirth);

    const visitData = {
      customerId: customerId,
      customerAge: customerAge,
      serviceId: req.body.serviceId,
      date: req.body.date,
      time: req.body.time || req.body.input_time,
      timeFinish: "-",
      status: "Sedang Jalan",
      staffId: req.user.uid,
      serviceCare: req.body.serviceCare,
      address: req.body.address,
      createdAt: timestamp,
      serviceName: req.body.serviceName,
    };

    let checkEmpty = commonFunctions.checkEmpty(visitData);

    if (checkEmpty.contains) {
      return res.render("admin/errorView", {
        tittle: "Oppps!! Data yang kamu masukkan belum lengkap nih",
        message: 'Form pada bagian "' + checkEmpty.value + '" belum kamu isi nih',
      });
    }

    await addDoc(collection(db, "visits"), visitData)
      .then(() => {
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  updateAppointmentStatusTrue: async (req, res) => {
    const appointmentId = req.params.appId;
    const data = JSON.stringify({
      status: true,
    });

    await axios
      .put(apiUrl + "/api/appointment/update/" + appointmentId, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => {
        console.log(response.data);
        return res.render("admin/successProcessApp");
      })
      .catch((err) => {
        return console.log(err);
      });
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
