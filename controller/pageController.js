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

const commonFunction = require("../middleware/commonFunctions")

module.exports = {
  viewAdminDashboard: async (req, res) => {
    const appointmentData = req.appointmentsData;
    const onGoingVisitData = [];

    const servicesData = req.servicesData;
    const customersData = req.customersData;

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

  viewStatisticPage: (req, res) => {
    const visitsData = req.visitsData
    const customersData = req.customersData
    const servicesData = req.servicesData

    const currentDate = commonFunction.getCurrentDate()
    
    
  },

  test: async (res) => {
    const output = process.env.google_private_key.replace(/\\n/gm, "\n");
    console.log(output);
    return;
  }
};