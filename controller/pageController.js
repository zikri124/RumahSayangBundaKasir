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
    const customersData = req.customersData
    const servicesData = req.servicesData
    const queryData = []
    const currentDate = commonFunction.getCurrentDate()
    const date2 = new Date()
    date2.setDate(date2.getDate() - 14)

    let month = date2.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = date2.getDate();
    if (date < 10) {
      date = "0" + date;
    }

    const dateString2 = date2.getFullYear() + "-" + month + "-" + date;

    const visitQuery = query(
      collection(db, "visits"),
      where("date", "<=", currentDate.string),
      where("date", ">", dateString2)
    );

    await getDocs(visitQuery)
      .then((querySnapshot) => {
        let totalSumTemp = 0
        let dateTemp = ""
        let totalVisit = 0
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const visit = {
            data: data,
            id: doc.id
          };

          if (dateTemp != "") {
            if (dateTemp == data.date) {
              if (data.total != undefined) {
                totalSumTemp += data.total
              }
              totalVisit += 1
            } else {
              const visitDateData = {
                sum: totalSumTemp,
                totalVisit: totalVisit,
                date: dateTemp
              }
              queryData.push(visitDateData)
              if (data.total != undefined) {
                totalSumTemp = data.total
              } else {
                totalSumTemp = 0
              }
              dateTemp = data.date
              totalVisit = 1
            }
          } else {
            dateTemp = data.date
            if (data.total != undefined) {
              totalSumTemp += data.total
            }
            totalVisit += 1
          }

          visitsData.push(visit);
        });

        const visitDateData = {
          sum: totalSumTemp,
          totalVisit: totalVisit,
          date: dateTemp
        }
        queryData.push(visitDateData)
      })
      .catch((error) => {
        console.log(error);
      });

    console.log({
      queryData: queryData
    })

    return res.render("admin/viewReport", {
      visitsData: visitsData,
      queryData: queryData,
      customersData: customersData,
      servicesData: servicesData
    })
  },

  test: async (res) => {
    const output = process.env.google_private_key.replace(/\\n/gm, "\n");
    console.log(output);
    return;
  }
};