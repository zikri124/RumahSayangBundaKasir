const firebase = require("../firebase");
const fetch = require("node-fetch")
const db = firebase.firestore;
const {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  limit,
  getDoc
} = require("firebase/firestore");

// const apiUrl = process.env.apiURL

module.exports = {
  getACustomerData: async (customerId) => {
    const customerRef = doc(db, "customers", customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return "No Document Found";
    }

    return customerSnap.data();
  },

  getCurrentDate: () => {
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

    return {
      string: dateNow,
      year: dateClass.getFullYear(),
      month: month,
      date: date
    }
  },

  getAge: (customerDOB) => {
    const date = new Date();
    const dateToCalculate = new Date(customerDOB);

    var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let d1 = dateToCalculate.getDate();
    let d2 = date.getDate();
    let m1 = dateToCalculate.getMonth();
    let m2 = date.getMonth();
    let y1 = dateToCalculate.getFullYear();
    let y2 = date.getFullYear();

    if (d1 > d2) {
      d2 = d2 + month[m2 - 1];
      m2 = m2 - 1;
    }
    if (m1 > m2) {
      m2 = m2 + 12;
      y2 = y2 - 1;
    }
    const d = d2 - d1;
    const m = m2 - m1;
    const y = y2 - y1;

    let age = "";

    if (y > 0) {
      age += y + "tahun";
    }
    if (m > 0) {
      age += m + "bulan";
    }
    if (d > 0) {
      age += d + "hari";
    }

    return age;
  }
};