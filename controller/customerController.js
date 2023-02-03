const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  doc,
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

  viewAnCustomer: (req, res) => {
    const customerData = req.customerData;
    const servicesData = req.servicesData;
    const visitsData = req.visitsData;

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

  updateCustomer: async (req, res) => {
    const customerId = req.params.customerId;

    const customerData = doc(db, "customers", customerId);

    await updateDoc(customerData, {
      name: req.body.name,
      numWa: req.body.wa,
      dateOfBirth: req.body.dateOfBirth,
      sex: req.body.sex
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
