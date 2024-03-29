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
  orderBy
} = require("firebase/firestore");

const commonFunctions = require("./commonFunctions");

const apiUrl = process.env.apiURL;

module.exports = {
  getAnUserData: async (req, res, next) => {
    req.userData = [];
    next();
  },

  getUsersData: async (req, res, next) => {
    req.usersData = [];
    next();
  },

  getCustomersData: async (req, res, next) => {
    const customersData = [];

    const customerQuery = query(collection(db, "customers"), orderBy("name", "asc"));

    await getDocs(customerQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const customer = {
            id: doc.id,
            data: doc.data(),
          };
          customersData.push(customer);
        });
        req.customersData = customersData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getACustomerData: async (req, res, next) => {
    const customerId = req.params.customerId;

    const customerRef = doc(db, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    const customer = {
      id: customerSnap.id,
      data: customerSnap.data(),
    };

    req.customerData = customer;
    next();
  },

  isCustomerExist: async (req, res, next) => {
    const customersData = [];

    const customerQuery = query(collection(db, "customers"), orderBy("name", "asc"));
    const name = req.body.name.toUpperCase();
    const dateOfBirth = req.body.dateOfBirth;

    let isFound = false

    await getDocs(customerQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const customer = {
            id: doc.id,
            data: doc.data(),
          };
          customersData.push(customer);

          if (name == customer.data.name && dateOfBirth == customer.data.dateOfBirth) {
            isFound = true
          }
        });
        req.customersData = customersData;
        if (isFound) {
          return res.render("admin/errorView", {
            tittle: "Pelanggan sudah terdaftar!",
            message: "Silahkan pilih dari daftar pelanggan, atau pastikan bahwa mendaftarkan pelanggan yang berbeda"
          })
        } else {
          next();
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getServicesAndAppointmentsData: async (req, res, next) => {
    await fetch(apiUrl + "/api/alldata", {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.appointmentsData = body.appointmentsData;
        req.servicesData = body.servicesData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAppointmentsData: async (req, res, next) => {
    await fetch(apiUrl + "/api/appointment", {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.appointmentsData = body.appointmentsData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAppointmentsDataByTime: async (req, res, next) => {
    const timeCode = req.params.timeCode;
    await fetch(apiUrl + "/api/appointment/filter/" + timeCode, {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.appointmentsData = body.appointmentsData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAppointmentsDataToday: async (req, res, next) => {
    const appointmentsData = req.appointmentsData;
    const todayAppointmentsData = [];

    const dateNow = commonFunctions.getCurrentDate().string;

    appointmentsData.forEach((appointmentData) => {
      if (appointmentData.data.date == dateNow && appointmentData.data.status == false) {
        todayAppointmentsData.push(appointmentData);
      }
    });

    req.appointmentsData = todayAppointmentsData;
    next();
  },

  getSessions: async (req, res, next) => {
    const date = req.query.date;
    const serviceId = req.query.serviceId;

    if (date == undefined || serviceId == undefined) {
      req.sessionsData = null;
      next();
    } else {
      await fetch(apiUrl + "/api/appointment/session?date=" + date + "&serviceId=" + serviceId, {
          method: "GET",
          headers: {
            Authorization: "bearer " + req.token,
          },
        })
        .then((response) => response.json())
        .then((body) => {
          const bodyData = body.sessionsData;
          const sessionsData = []
          bodyData.forEach(session => {
            if (session.data.status != "cancelled") {
              sessionsData.push(session)
            }
          });

          req.sessionsData = sessionsData
          next();
        })
        .catch((err) => {
          return console.log(err);
        });
    }
  },

  getSessionsTime: async (req, res, next) => {
    await fetch(apiUrl + "/api/session", {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.sessions = body.sessions;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getSessionAndTime: async (req, res, next) => {
    const date = req.query.date;
    const serviceId = req.query.serviceId;
    const serviceCare = req.query.serviceCare

    await fetch(apiUrl + "/api/sessionsntime?date=" + date + "&serviceId=" + serviceId + "&serviceCare=" + serviceCare, {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.sessions = body.sessions;
        req.sessionsData = body.sessionsData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAnAppointmentData: async (req, res, next) => {
    const appId = req.params.appId;
    await fetch(apiUrl + "/api/appointment/" + appId, {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.appointmentData = body.appointmentData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
    next();
  },

  getVisitsData: async (req, res, next) => {
    const visitsData = [];

    const visitQuery = query(collection(db, "visits"), orderBy("date", "desc"));
    await getDocs(visitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const visit = {
            id: doc.id,
            data: doc.data(),
          };

          visitsData.push(visit);
        });
        req.visitsData = visitsData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getVisitsDataByCustomer: async (req, res, next) => {
    const customerId = req.params.customerId;
    const visitsData = [];

    const visitQuery = query(collection(db, "visits"), where("customerId", "==", customerId));

    await getDocs(visitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const visitData = {
            id: doc.id,
            data: doc.data(),
          };
          visitsData.push(visitData);
        });
        req.visitsData = visitsData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getOnGoingVisitsData: async (req, res, next) => {
    const date = req.query.date;
    const serviceId = req.query.serviceId;
    const onGoingVisits = []

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
        req.onGoingVisits = onGoingVisits
        next()
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAVisitData: async (req, res, next) => {
    const visitId = req.params.visitId;

    const visitRef = doc(db, "visits", visitId);
    const visitSnap = await getDoc(visitRef);

    if (!visitSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    const visit = {
      id: visitSnap.id,
      data: visitSnap.data(),
    };

    req.visitData = visit;
    next();
  },

  getServicesData: async (req, res, next) => {
    await fetch(apiUrl + "/api/service", {
        method: "GET",
        headers: {
          Authorization: "bearer " + req.token,
        },
      })
      .then((response) => response.json())
      .then((body) => {
        req.servicesData = body.servicesData;
        next();
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAServiceData: async (req, res, next) => {
    const serviceId = req.params.serviceId;

    const serviceRef = doc(db, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);

    if (!serviceSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    req.serviceData = serviceSnap;
    next();
  },
};