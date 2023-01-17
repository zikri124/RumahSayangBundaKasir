const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  getDoc
} = require("firebase/firestore");

module.exports = {
  viewAdminDashboard: async (req, res) => {
    const appointmentData = [];
    const onGoingVisitData = [];

    const servicesData = req.servicesData;
    const customersData = req.customersData;

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

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("date", "==", dateNow),
      where("status", "==", false)
    );

    await getDocs(appointmentQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const appointment = {
            data: doc.data(),
            id: doc.id
          };
          appointmentData.push(appointment);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    const onGoingVisitQuery = query(
      collection(db, "visits"),
      where("status", "==", "Sedang Jalan")
    );

    await getDocs(onGoingVisitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const appointment = {
            data: doc.data(),
            id: doc.id
          };
          onGoingVisitData.push(appointment);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return res.render("admin/dashboard", {
      appointmentData: appointmentData,
      onGoingVisitData: onGoingVisitData,
      servicesData: servicesData,
      customersData: customersData
    });
  },

  viewPrivacyPolicyPage: (req, res) => {
    return res.render("client/privacyPolicy");
  },

  test: async (res) => {
    const output = process.env.google_private_key.replace(/\\n/gm, "\n");
    console.log(output);
    return;
  }
};
