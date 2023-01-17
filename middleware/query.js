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
  updateDoc,
  orderBy
} = require("firebase/firestore");

module.exports = {
  getAnUserData: async (req, res, next) => {
    const userId = req.params.userId;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    req.userData = userSnap;
    next();
  },

  getUsersData: async (req, res, next) => {
    const usersData = [];

    const userQuery = query(collection(db, "users"));
    await getDocs(userQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          usersData.push(doc);
        });
        req.usersData = usersData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getCustomersData: async (req, res, next) => {
    const customersData = [];

    const customerQuery = query(collection(db, "customers"));

    await getDocs(customerQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          customersData.push(doc);
        });
        req.customersData = customersData;
        next();
      })
      .catch((error) => {
        return console.log(error);
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

    req.customerData = customerSnap;
    next();
  },

  getServicesAndAppointmentsData: async (req, res, next) => {
    const appointmentsData = "";
    const servicesData = "";

    fetch("https://s8mii5.sse.codesandbox.io/api/alldata", {
      method: "GET",
      headers: {
        // Authorization: "Bearer " + req.token
        Authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJzZkpzdDI4SHh2Z3hZQzA1Q1hyV1RXZGtqcDQyIiwibmFtZSI6ImFkbWluMSIsImlhdCI6MTY3Mzk1MDUwMX0.1qUMvtF40HfQKd7EzwGIwb1Vqd6ZPeYQmCWR8U5AiTw"
      }
    })
      .then((response) => response.text())
      .then((body) => {
        return res.json({ body });
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAppointmentsData: async (req, res, next) => {
    // const appointmentsData = "";
    console.log(req.token);

    fetch("https://s8mii5.sse.codesandbox.io/api/appointment", {
      method: "GET",
      headers: {
        Authorization: "bearer " + req.token
      }
    })
      .then((response) => response.text())
      .then((body) => {
        return res.json(body);
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  getAppointmentsDataByTime: async (req, res, next) => {
    const appointmentsData = [];
    const timeCode = req.params.timeCode;

    const dateClass = new Date();
    let month = dateClass.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = dateClass.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateNow = dateClass.getFullYear() + "-" + month + "-" + date;

    let code = "";

    if (timeCode == "past") {
      code = "<";
    } else if (timeCode == "soon") {
      code = ">=";
    }

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("date", code, dateNow),
      orderBy("date"),
      orderBy("time")
    );

    await getDocs(appointmentQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          appointmentsData.push(doc);
        });
        req.appointmentsData = appointmentsData;
        next();
      })
      .catch((error) => {
        return console.log(error);
      });
  },

  getAppointmentsDataByDate: async (req, res, next) => {
    console.log(req.query);
    if (req.query.date == null || req.query.serviceId == null) {
      req.sessionsData = null;
      next();
    } else {
      const date = req.query.date;
      const serviceId = req.query.serviceId;

      const sessionsData = [];

      const appointmentQuery = query(
        collection(db, "appointments"),
        where("date", "==", date),
        where("serviceId", "==", serviceId)
      );

      await getDocs(appointmentQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            sessionsData.push(doc.data());
          });
          req.sessionsData = sessionsData;
          next();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },

  getAnAppointmentData: async (req, res, next) => {
    const appointmentId = req.params.appId;

    const appointmentRef = doc(db, "appointments", appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      req.userData = [];
      console.log("No Document Found");
      next();
    }

    req.appointmentData = appointmentSnap;
    next();
  },

  getVisitsData: async (req, res, next) => {
    const visitsData = [];

    const visitQuery = query(collection(db, "visits"), orderBy("date", "desc"));
    await getDocs(visitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          visitsData.push(doc);
        });
        req.visitsData = visitsData;
        next();
      })
      .catch((error) => {
        return console.log(error);
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

    req.visitData = visitSnap;
    next();
  },

  getServicesData: async (req, res, next) => {
    const servicesData = [];

    const serviceQuery = query(collection(db, "services"));
    await getDocs(serviceQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          servicesData.push(doc);
        });
        req.servicesData = servicesData;
        next();
      })
      .catch((error) => {
        return console.log(error);
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
  }
};
