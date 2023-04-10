const firebase = require("../firebase");
const db = firebase.firestore;
const {
  collection,
  doc,
  addDoc,
  updateDoc,
  QuerySnapshot,
  deleteDoc,
  Timestamp
} = require("firebase/firestore");
const commonFunctions = require("../middleware/commonFunctions");

module.exports = {
  viewCustomers: async (req, res) => {
    const customersdata = req.customersData;

    return res.render("admin/viewCustomer", {
      customersdata: customersdata,
      isError: false
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

  addCustomer: async (req, res, next) => {
    const timestamp = Timestamp.now()

    const numWa = commonFunctions.checkFormatNumWa(req.body.wa)

    const customerData = {
      name: req.body.name.toUpperCase(),
      numWa: numWa,
      sex: req.body.sex,
      dateOfBirth: req.body.dateOfBirth,
      createdAt: timestamp
    };

    await addDoc(collection(db, "customers"), customerData)
      .then(async (doc) => {
        // return res.status(200).redirect("/");
        req.customerId = doc.id
        next()
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  updateCustomer: async (req, res) => {
    const customerId = req.params.customerId;
    const timestamp = Timestamp.now();
    const customerOldData = req.customerData;
    const numWa = commonFunctions.checkFormatNumWa(req.body.wa)

    const customerData = doc(db, "customers", customerId);

    await updateDoc(customerData, {
        name: req.body.name.toUpperCase(),
        numWa: numWa,
        dateOfBirth: req.body.dateOfBirth,
        sex: req.body.sex,
        updatedAt: timestamp
      })
      .then(async () => {
        const data = {
          time: timestamp,
          oldname: customerOldData.data.name,
          newname: req.body.name,
          olddob: customerOldData.data.dateOfBirth,
          newdob: req.body.dateOfBirth,
          oldnumwa: customerOldData.data.numWa,
          newnumwa: req.body.wa,
          type: "customer"
        }
        await addDoc(collection(db, "logs"), data)
          .then(() => {
            return res.cookie("data", "").status(200).redirect("/customer");
          })
          .catch((err) => {
            return console.log(err)
          })
      })
      .catch((err) => {
        return console.log(err);
      });
  },

  deleteCustomer: async (req, res) => {
    const customerId = req.params.customerId;

    await deleteDoc(doc(db, "customers", customerId));

    return res.status(200).redirect("/customer");
  }
};