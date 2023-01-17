const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  doc,
  limit,
  getDoc,
  addDoc,
  updateDoc,
  QuerySnapshot,
  deleteDoc
} = require("firebase/firestore");

module.exports = {
  viewCustomers: async (req, res) => {
    const customersdata = req.customersData;

    return res.render("admin/viewCustomer", {
      customersdata: customersdata
    });
  },

  viewAnCustomer: async (req, res) => {
    const customerData = req.customerData;
    const customerId = req.params.customerId;
    const servicesData = req.servicesData;
    const visitsData = [];

    const visitQuery = query(
      collection(db, "visits"),
      where("customerId", "==", customerId)
    );

    await getDocs(visitQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          visitsData.push(doc);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return res.render("admin/viewACustomer", {
      customerData: customerData,
      visitsData: visitsData,
      servicesData: servicesData
    });
  },

  addCustomer: async (req, res) => {
    const customerData = {
      name: req.body.name,
      numWa: req.body.wa,
      sex: req.body.sex,
      dateOfBirth: req.body.dateOfBirth
    };

    await addDoc(collection(db, "customers"), customerData)
      .then(async () => {
        return res.status(200).redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
  },

  // viewUpdateCustomer: async (req, res) => {
  //   //ga jadi, pake modal aja ------------------------------
  //   const customerData = req.customerData;

  //   return res.render("admin/", {
  //     customerData: customerData
  //   });
  // },

  updateCustomer: async (req, res) => {
    const customerId = req.params.customerId;

    const customerData = doc(db, "customers", customerId);

    await updateDoc(customerData, {
      name: req.body.name,
      numWa: req.body.wa,
      dateOfBirth: req.body.dateOfBirth
    })
      .then(() => {
        return res.cookie("data", "").status(200).redirect("/customer");
      })
      .catch((error) => {
        console.log(error);
      });
  },

  deleteCustomer: async (req, res) => {
    const customerId = req.params.customerId;

    await deleteDoc(doc(db, "customers", customerId));

    return res.status(200).redirect("/customer");
  }
};
