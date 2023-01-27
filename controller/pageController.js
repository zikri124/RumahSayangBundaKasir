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
          const visit = {
            data: doc.data(),
            id: doc.id
          };
          onGoingVisitData.push(visit);
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

  viewStatisticPage: async (req, res) => {
    const visitsData = []
    // const customersData = req.customersData
    // const servicesData = req.servicesData
    const data = []

    const currentDate = commonFunction.getCurrentDate()

    //get visitData from 1 month
    const visitQuery = query(
      collection(db, "visits"),
      where("date", "<=", currentDate.string),
      where("date", ">", currentDate.year + "-" + currentDate.month + "-" + (currentDate.date - 7))
    );

    await getDocs(visitQuery)
      .then((querySnapshot) => {
        let totalSumTemp = 0
        let dateTemp = ""
        querySnapshot.forEach((doc) => {
          const visit = {
            data: doc.data(),
            id: doc.id
          };

          if (dateTemp != "") {
             
          } else {
            dateTemp = doc.data().date
          }
          
          visitsData.push(visit);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return res.json(visitsData)
  },

  test: async (res) => {
    const output = process.env.google_private_key.replace(/\\n/gm, "\n");
    console.log(output);
    return;
  }
};